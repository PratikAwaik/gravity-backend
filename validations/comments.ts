import { UserInputError } from "apollo-server-core";
import {
  ICreateCommentArgs,
  IGetCommentsArgs,
  IUpdateCommentScoreArgs,
} from "../models/comments";
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

export const validateUpdateCommentScore = (args: IUpdateCommentScoreArgs) => {
  if (!args.commentId) {
    throwError(UserInputError, "commentId is required");
  } else if (args.direction === null || args.direction === undefined) {
    throwError(UserInputError, "direction is required");
  }
};
