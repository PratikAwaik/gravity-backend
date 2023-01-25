import { User } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "./context";

export interface ILoginUserArgs {
  username: string;
  password: string;
}

export interface IRegisterUserArgs extends ILoginUserArgs {
  email: string;
}

export interface UserWithToken extends User {
  token?: {
    value?: string;
  };
}

export interface IUpdateUserArgs {
  profilePic: string;
}

export interface IGetUserDetailsArgs {
  username: string;
}

export interface IUsersController {
  allUsers(): Promise<User[]>;
  registerUser(
    _: unknown,
    args: IRegisterUserArgs
  ): Promise<UserWithToken | Error>;
  loginUser(_: unknown, args: ILoginUserArgs): Promise<any>;
  updateLoggedInUser(
    _: unknown,
    args: IUpdateUserArgs,
    context: Context<IApolloContext>
  ): Promise<User | Error>;
}
