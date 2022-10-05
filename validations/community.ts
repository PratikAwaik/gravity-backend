import { UserInputError } from "apollo-server";
import { throwError } from "../utils/errors";

export const validateCreateSubredditDetails = (args: any) => {
  if (args?.name?.length < 3) {
    throwError(
      UserInputError,
      "Community name should be more than 3 characters"
    );
  } else if (args?.name?.length > 21) {
    throwError(
      UserInputError,
      "Community name should be less than 21 characters"
    );
  } else if (args?.description?.length < 10) {
    throwError(
      UserInputError,
      "Description of the community should not be less than 10 characters"
    );
  }
};
