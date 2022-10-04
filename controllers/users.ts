import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  validateLoginUserDetails,
  validateRegisterUserDetails,
} from "../validations/users";
import { handleError, throwError } from "../utils/errors";
import { UserInputError } from "apollo-server";

export default class UserController {
  /**
   * get all users
   */
  static allUsers = async () => {
    return await prisma.user.findMany({});
  };

  /**
   * register user
   */
  static registerUser = async (_: any, args: any) => {
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
  static loginUser = async (_: any, args: any) => {
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
