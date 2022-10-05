import { Prisma, User } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server";
import { Context } from "apollo-server-core";

export const throwError = (
  errorType: any,
  errorMessage: string,
  options?: any
) => {
  throw new errorType(errorMessage, options);
};

export const handleError = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // unique constraint error
    switch (error.code) {
      case "P2002":
        const { target } = error.meta as Record<string, string>;
        return throwError(UserInputError, `${target[0]} should be unique.`);
      default:
        return error;
    }
  } else return error;
};

export const handleAuthenticationError = (
  context: Context<{ currentUser: User }>
) => {
  const { currentUser } = context;
  if (!currentUser) {
    return throwError(AuthenticationError, "Please login to continue");
  }
};
