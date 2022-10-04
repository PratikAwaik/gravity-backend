import { Prisma } from "@prisma/client";
import { UserInputError } from "apollo-server";

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
    if (error.code === "P2002") {
      const { target } = error.meta as Record<string, string>;
      return throwError(UserInputError, `${target[0]} should be unique.`);
    }
    return error;
  } else return error;
};
