import { Comment } from "@prisma/client";
import { Context } from "apollo-server-core";
import {
  ICommentsController,
  ICreateCommentArgs,
  IGetCommentsArgs,
} from "../models/comments";
import { IApolloContext } from "../models/context";
import { handleAuthenticationError, handleError } from "../utils/errors";
import prisma from "../utils/prisma";
import {
  validateCreateCommentDetails,
  validateGetComments,
} from "../validations/comments";

export default class CommentsController implements ICommentsController {
  /**
   * get all comments
   */
  public getComments = async (
    _: unknown,
    args: IGetCommentsArgs
  ): Promise<Comment[]> => {
    validateGetComments(args);
    return await prisma.comment.findMany({
      where: {
        postId: args.postId,
      },
      include: {
        author: true,
      },
    });
  };

  /**
   * create comment
   */
  public createComment = async (
    _: unknown,
    args: ICreateCommentArgs,
    context: Context<IApolloContext>
  ) => {
    handleAuthenticationError(context);
    validateCreateCommentDetails(args);

    try {
      const comment = await prisma.comment.create({
        data: {
          content: args.content,
          postId: args.postId,
          authorId: context.currentUser.id,
          parentId: args.parentId || null,
        },
      });
      return comment;
    } catch (error) {
      return handleError(error);
    }
  };
}
