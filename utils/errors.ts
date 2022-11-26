import { Prisma } from "@prisma/client";
import { AuthenticationError, UserInputError } from "apollo-server";
import { Context } from "apollo-server-core";
import { GraphQLError } from "graphql";
import { IApolloContext } from "../models/context";

export const throwError = (
  errorType: any,
  errorMessage: any,
  options?: any
) => {
  throw new errorType(errorMessage, options);
};

export const throwForbiddenError = () => {
  throwError(GraphQLError, "You are not authorized to perform this action", {
    extensions: {
      code: "FORBIDDEN",
      http: { status: 403 },
    },
  });
};

export const handleError = (error: Error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // unique constraint error
    switch (error.code) {
      case "P2002":
        const { target } = error.meta as Record<string, any>;
        return throwError(
          UserInputError,
          `${
            target[0][0].toUpperCase() + target[0].slice(1)
          } should be unique.`,
          { field: target[0] }
        );
      default:
        return error;
    }
  } else return error;
};

export const handleAuthenticationError = (context: Context<IApolloContext>) => {
  const { currentUser } = context;
  if (!currentUser) {
    return throwError(AuthenticationError, "Please login to continue");
  }
};
