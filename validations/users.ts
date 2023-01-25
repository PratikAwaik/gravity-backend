import { UserInputError } from "apollo-server";
import {
  IGetUserDetailsArgs,
  ILoginUserArgs,
  IRegisterUserArgs,
  IUpdateUserArgs,
} from "../models/users";
import { throwError } from "../utils/errors";

export const validateRegisterUserDetails = (args: IRegisterUserArgs) => {
  if (args?.password?.length < 5) {
    throwError(UserInputError, "Password must contain more than 5 characters.");
  } else if (args?.username?.length < 3) {
    throwError(
      UserInputError,
      "Username should contain more than 3 characters"
    );
  } else if (args?.username?.length > 21) {
    throwError(UserInputError, "Username cannot be more than 21 characters");
  } else if (!args?.email) {
    throwError(UserInputError, "Email is required");
  }
};

export const validateLoginUserDetails = (args: ILoginUserArgs) => {
  if (args?.password?.length < 5) {
    throwError(UserInputError, "Password must contain more than 5 characters.");
  } else if (args?.username?.length < 3) {
    throwError(
      UserInputError,
      "Username should contain more than 3 characters"
    );
  } else if (args?.username?.length > 21) {
    throwError(UserInputError, "Username cannot be more than 21 characters");
  }
};

export const validateUpdateUserArgs = (args: IUpdateUserArgs) => {
  if (!args.profilePic) {
    throwError(UserInputError, "Profile Picture is required");
  }
};

export const validateGetUserDetailsArgs = (args: IGetUserDetailsArgs) => {
  if (!args.username) {
    throwError(UserInputError, "Username is required");
  }
};
