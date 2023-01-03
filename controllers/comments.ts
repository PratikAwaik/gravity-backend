import { Comment } from "@prisma/client";
import { Context } from "apollo-server-core";
import {
  ICommentsController,
  ICreateCommentArgs,
  IDeleteCommentArgs,
  IGetCommentsArgs,
  IUpdateCommentArgs,
  IUpdateCommentScoreArgs,
} from "../models/comments";
import { IApolloContext } from "../models/context";
import { Direction } from "../models/enums";
import {
  handleAuthenticationError,
  handleError,
  throwForbiddenError,
} from "../utils/errors";
import { getInfiniteNestedCommentsQuery, getScore } from "../utils/helpers";
import prisma from "../utils/prisma";
import {
  validateCreateCommentDetails,
  validateDeleteCommentArgs,
  validateGetComments,
  validateUpdateCommentArgs,
  validateUpdateCommentScore,
} from "../validations/comments";

export default class CommentsController implements ICommentsController {
  /**
   * get all comments
   */
  public getComments = async (
    _: unknown,
    args: IGetCommentsArgs,
    context: Context<IApolloContext>
  ): Promise<Comment[]> => {
    validateGetComments(args);
    const query = {
      include: {
        author: true,
        commentScores: {
          where: {
            userId: context.currentUser?.id,
          },
        },
        children: {},
      },
    };

    const newQuery = getInfiniteNestedCommentsQuery(
      query,
      JSON.parse(JSON.stringify(query))
    );

    return await prisma.comment.findMany({
      where: {
        AND: [{ postId: args.postId }, { parentId: args.parentId ?? null }],
      },
      orderBy: {
        createdAt: "asc",
      },
      ...newQuery,
    });
  };

  /**
   * create comment
   */
  public createComment = async (
    _: unknown,
    args: ICreateCommentArgs,
    context: Context<IApolloContext>
  ): Promise<Comment | Error> => {
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
        include: {
          author: true,
          commentScores: {
            where: {
              userId: context.currentUser.id,
            },
          },
          children: true,
        },
      });

      await prisma.post.update({
        where: {
          id: args.postId,
        },
        data: {
          commentsCount: {
            increment: 1,
          },
        },
      });
      return comment;
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * update comment
   */
  public updateComment = async (
    _: unknown,
    args: IUpdateCommentArgs,
    context: Context<IApolloContext>
  ): Promise<Comment | Error> => {
    handleAuthenticationError(context);
    validateUpdateCommentArgs(args);

    try {
      const comment = await prisma.comment.findUniqueOrThrow({
        where: {
          id: args.commentId,
        },
      });

      if (comment.authorId !== context.currentUser.id) {
        throwForbiddenError();
      }

      return await prisma.comment.update({
        where: {
          id: args.commentId,
        },
        data: {
          content: args.content,
        },
      });
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * delete comment
   */
  public deleteComment = async (
    _: unknown,
    args: IDeleteCommentArgs,
    context: Context<IApolloContext>
  ): Promise<Comment | Error> => {
    handleAuthenticationError(context);
    validateDeleteCommentArgs(args);

    try {
      const comment = await prisma.comment.findUniqueOrThrow({
        where: {
          id: args.commentId,
        },
      });

      if (comment.authorId !== context.currentUser.id) {
        throwForbiddenError();
      }

      const deletedComment = await prisma.comment.update({
        where: {
          id: args.commentId,
        },
        data: {
          deleted: true,
        },
      });

      await prisma.post.update({
        where: {
          id: args.postId,
        },
        data: {
          commentsCount: {
            decrement: 1,
          },
        },
      });
      return deletedComment;
    } catch (error) {
      return handleError(error as Error);
    }
  };

  public updateCommentScore = async (
    _: unknown,
    args: IUpdateCommentScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Comment | Error> => {
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
      return handleError(error as Error);
    }
  };
}
