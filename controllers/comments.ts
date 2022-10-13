import { Comment } from "@prisma/client";
import { Context, UserInputError } from "apollo-server-core";
import {
  ICommentsController,
  ICreateCommentArgs,
  IGetCommentsArgs,
  IUpdateCommentScoreArgs,
} from "../models/comments";
import { IApolloContext } from "../models/context";
import { Direction } from "../models/enums";
import {
  handleAuthenticationError,
  handleError,
  throwError,
} from "../utils/errors";
import { getScore } from "../utils/helpers";
import prisma from "../utils/prisma";
import {
  validateCreateCommentDetails,
  validateGetComments,
  validateUpdateCommentScore,
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

  public updateCommentScore = async (
    _: unknown,
    args: IUpdateCommentScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Comment> => {
    handleAuthenticationError(context);
    validateUpdateCommentScore(args);

    try {
      let newCommentScoreEntity;

      const comment = await prisma.comment.findUniqueOrThrow({
        where: {
          id: args.commentId,
        },
      });

      const commentScore = await prisma.commentScore.findFirst({
        where: {
          AND: [
            { commentId: args.commentId },
            { userId: context.currentUser.id },
          ],
        },
      });

      const newScore = getScore(args, comment, commentScore);

      if (args.direction === Direction.UNVOTE && commentScore?.id) {
        await prisma.commentScore.delete({
          where: {
            id: commentScore?.id,
          },
        });
      } else if (args.direction !== Direction.UNVOTE) {
        newCommentScoreEntity = await prisma.commentScore.upsert({
          create: {
            userId: context.currentUser.id,
            commentId: args.commentId,
            direction: args.direction,
          },
          update: {
            direction: args.direction,
          },
          where: {
            id: commentScore?.id || "",
          },
        });
      }

      return await prisma.comment.update({
        where: {
          id: args.commentId,
        },
        data: {
          score: newScore,
          ...(args.direction !== Direction.UNVOTE && {
            commentScores: {
              connect: {
                id: newCommentScoreEntity?.id,
              },
            },
          }),
        },
        include: {
          commentScores: true,
        },
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
