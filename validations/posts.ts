import { UserInputError } from "apollo-server";
import { ICreatePostArgs, IUpdatePostScoreArgs } from "../models/posts";
import { throwError } from "../utils/errors";

export const validateCreatePostDetails = (args: ICreatePostArgs) => {
  if (args?.title?.length < 3) {
    throwError(UserInputError, "Post Title should be more than 3 characters");
  } else if (args?.content?.length < 3) {
    throwError(
      UserInputError,
      "Post Description should be more than 3 characters"
    );
  } else if (!args?.type) {
    throwError(UserInputError, "Please select the post type");
  } else if (!args.communityId) {
    throwError(UserInputError, "Please select community");
  }
};

export const validateUpdatePostScore = (args: IUpdatePostScoreArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "post_id is required");
  } else if (args.direction === null || args.direction === undefined) {
    throwError(UserInputError, "direction is required");
  }
};
