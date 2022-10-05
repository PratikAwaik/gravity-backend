import { UserInputError } from "apollo-server";
import { throwError } from "../utils/errors";

export const validateCreatePostDetails = (args: any) => {
  if (args?.title?.length < 3) {
    return throwError(
      UserInputError,
      "Post Title should be more than 3 characters"
    );
  } else if (args?.content?.length < 3) {
    return throwError(
      UserInputError,
      "Post Description should be more than 3 characters"
    );
  } else if (!args?.type) {
    return throwError(UserInputError, "Please select the post type");
  } else if (!args.communityId) {
    return throwError(UserInputError, "Please select community");
  }
};
