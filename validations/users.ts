import { UserInputError } from "apollo-server";
import { throwError } from "../utils/errors";

export const validateRegisterUserDetails = (args: any) => {
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

export const validateLoginUserDetails = (args: any) => {
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
