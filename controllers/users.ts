import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  validateLoginUserDetails,
  validateRegisterUserDetails,
} from "../validations/users";
import { handleError, throwError } from "../utils/errors";
import { UserInputError } from "apollo-server";
import { User } from "@prisma/client";
import {
  ILoginUserArgs,
  IRegisterUserArgs,
  IUsersController,
  UserWithToken,
} from "../models/users";

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
  ): Promise<UserWithToken | void> => {
    validateRegisterUserDetails(args);
    try {
      const passwordHash = await bcrypt.hash(args.password, 10);
      const user = await prisma.user.create({
        data: {
          ...args,
          password: passwordHash,
          prefixedUsername: "u/" + args.username,
        },
      });
      const userForToken = {
        username: user.username,
        id: user.id,
      };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET || "");
      return { ...user, token: { value: token } };
    } catch (error: any) {
      handleError(error);
    }
  };

  /**
   * login user
   */
  // * return type should be UserWithToken
  public loginUser = async (_: unknown, args: ILoginUserArgs): Promise<any> => {
    validateLoginUserDetails(args);

    try {
      const user = await prisma.user.findFirst({
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
      handleError(error);
    }
  };
}
