import { UserInputError } from "apollo-server-core";
import { ICreateCommentArgs, IGetCommentsArgs } from "../models/comments";
import { throwError } from "../utils/errors";

export const validateGetComments = (args: IGetCommentsArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "post_id is required");
  }
};

export const validateCreateCommentDetails = (args: ICreateCommentArgs) => {
  if (!args.content) {
    throwError(UserInputError, "Content should not be empty");
  } else if (!args.postId) {
    throwError(UserInputError, "post_id should not be empty");
  }
};
