import { Comment } from "@prisma/client";
import { Context, UserInputError } from "apollo-server-core";
import {
  ICommentsController,
  ICreateCommentArgs,
  IGetCommentsArgs,
  IUpdateCommentScoreArgs,
} from "../models/comments";
import { IApolloContext } from "../models/context";
import {
  handleAuthenticationError,
  handleError,
  throwError,
} from "../utils/errors";
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
      let newScore;
      let newCommentScore;

      const comment = await prisma.comment.findUnique({
        where: {
          id: args.commentId,
        },
      });

      if (!comment) {
        throwError(UserInputError, "Comment not found");
      }

      const commentScore = await prisma.commentScore.findFirst({
        where: {
          AND: [
            { commentId: args.commentId },
            { userId: context.currentUser.id },
          ],
        },
      });

      if (!commentScore) {
        if (args.direction === 1) {
          // upvote
          newScore = (comment?.score ?? 0) + 1;
        } else if (args.direction === -1) {
          // downvote
          newScore = (comment?.score ?? 0) - 1;
        }

        newCommentScore = await prisma.commentScore.create({
          data: {
            commentId: args.commentId,
            userId: context.currentUser.id,
            direction: args.direction,
          },
        });
      } else {
        if (commentScore.direction === 0 && args.direction === 1) {
          // upvote
          newScore = (comment?.score ?? 0) + 1;
        } else if (commentScore.direction === 0 && args.direction === -1) {
          // downvote
          newScore = (comment?.score ?? 0) - 1;
        } else if (commentScore.direction === 1 && args.direction === 0) {
          // unvote
          newScore = (comment?.score ?? 0) - 1;
        } else if (commentScore.direction === 1 && args.direction === -1) {
          // downvote
          newScore = (comment?.score ?? 0) - 2;
        } else if (commentScore.direction === -1 && args.direction === 0) {
          // unvote
          newScore = (comment?.score ?? 0) + 1;
        } else if (commentScore.direction === -1 && args.direction === 1) {
          // upvote
          newScore = (comment?.score ?? 0) + 2;
        }

        newCommentScore = await prisma.commentScore.update({
          where: {
            id: commentScore.id,
          },
          data: {
            direction: args.direction,
          },
        });
      }

      return await prisma.comment.update({
        where: {
          id: args.commentId,
        },
        data: {
          score: newScore,
          commentScores: {
            connect: {
              id: newCommentScore.id,
            },
          },
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
