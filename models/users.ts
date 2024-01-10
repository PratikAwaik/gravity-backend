import {User} from "@prisma/client";
import {Context} from "apollo-server-core";
import {IApolloContext} from "./context";
import {IIconPayload} from "./common";

export interface IGetAllUsersArgs {
  pageNo: number | null;
  search?: string;
}

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
  payload: {
    userId: string;
    icon: IIconPayload;
  };
}

export interface IGetUserDetailsArgs {
  username: string;
}

export interface IUsersController {
  getAllUsers(_: unknown, args: IGetAllUsersArgs): Promise<User[]>;
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
