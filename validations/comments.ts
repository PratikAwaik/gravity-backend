import { UserInputError } from "apollo-server-core";
import {
  ICreateCommentArgs,
  IDeleteCommentArgs,
  IGetCommentsArgs,
  IUpdateCommentArgs,
  IUpdateCommentScoreArgs,
} from "../models/comments";
import { throwError } from "../utils/errors";

export const validateGetComments = (args: IGetCommentsArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "postId is required");
  }
};

export const validateCreateCommentDetails = (args: ICreateCommentArgs) => {
  if (!args.content) {
    throwError(UserInputError, "Content should not be empty");
  } else if (!args.postId) {
    throwError(UserInputError, "postId should not be empty");
  }
};

export const validateUpdateCommentArgs = (args: IUpdateCommentArgs) => {
  if (!args.commentId) {
    throwError(UserInputError, "commentId is required");
  } else if (!args.content) {
    throwError(UserInputError, "Content should not be empty");
  }
};

export const validateDeleteCommentArgs = (args: IDeleteCommentArgs) => {
  if (!args.postId) {
    throwError(UserInputError, "postId is required");
  } else if (!args.commentId) {
    throwError(UserInputError, "commentId is required");
  }
};

export const validateUpdateCommentScore = (args: IUpdateCommentScoreArgs) => {
  if (!args.commentId) {
    throwError(UserInputError, "commentId is required");
  } else if (!args.direction) {
    throwError(UserInputError, "direction is required");
  }
};
