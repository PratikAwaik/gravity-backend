import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  validateLoginUserDetails,
  validateRegisterUserDetails,
  validateUpdateUserArgs,
} from "../validations/users";
import {
  handleAuthenticationError,
  handleError,
  throwError,
} from "../utils/errors";
import { UserInputError } from "apollo-server";
import { User } from "@prisma/client";
import {
  ILoginUserArgs,
  IRegisterUserArgs,
  IUpdateUserArgs,
  IUsersController,
  UserWithToken,
} from "../models/users";
import { Context } from "apollo-server-core";
import { IApolloContext } from "../models/context";

export default class UserController implements IUsersController {
  /**
   * get all users
   */
  public allUsers = async (): Promise<User[]> => {
    return await prisma.user.findMany({});
  };

  /**
   * register user
   */
  public registerUser = async (
    _: unknown,
    args: IRegisterUserArgs
  ): Promise<UserWithToken | Error> => {
    validateRegisterUserDetails(args);
    try {
      const passwordHash = await bcrypt.hash(args.password, 10);
      const user = await prisma.user.create({
        data: {
          ...args,
          password: passwordHash,
          prefixedName: "u/" + args.username,
        },
      });
      const userForToken = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET || "");
      return { ...user, token: { value: token } };
    } catch (error: any) {
      return handleError(error as Error);
    }
  };

  /**
   * login user
   */
  // * return type should be UserWithToken
  public loginUser = async (
    _: unknown,
    args: ILoginUserArgs
  ): Promise<any | Error> => {
    validateLoginUserDetails(args);

    try {
      const user = await prisma.user.findUnique({
        where: {
          username: args.username,
        },
      });

      const isPasswordCorrect = user
        ? await bcrypt.compare(args.password, user.password)
        : false;

      if (!isPasswordCorrect) {
        throwError(UserInputError, "Invalid username or password", {
          invalidArgs: args,
        });
      }

      const userForToken = {
        username: user?.username,
        id: user?.id,
      };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET || "");
      return { ...user, token: { value: token } };
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * update logged in user
   */
  public updateLoggedInUser = async (
    _: unknown,
    args: IUpdateUserArgs,
    context: Context<IApolloContext>
  ): Promise<User | Error> => {
    handleAuthenticationError(context);
    validateUpdateUserArgs(args);

    try {
      return await prisma.user.update({
        where: {
          id: context.currentUser.id,
        },
        data: {
          profilePic: args.profilePic,
        },
      });
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * get user subscriptions
   */
  public getUserSubscriptions = async (
    _: unknown,
    __: unknown,
    context: Context<IApolloContext>
  ) => {
    handleAuthenticationError(context);

    return await prisma.user
      .findUnique({
        where: {
          id: context.currentUser.id,
        },
        select: {
          joinedCommunities: true,
        },
      })
      .joinedCommunities();
  };
}
