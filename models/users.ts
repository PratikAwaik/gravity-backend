import { User } from "@prisma/client";

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

export interface IUsersController {
  allUsers(): Promise<User[]>;
  registerUser(
    _: unknown,
    args: IRegisterUserArgs
  ): Promise<UserWithToken | void>;
  loginUser(_: unknown, args: ILoginUserArgs): Promise<any>;
}
