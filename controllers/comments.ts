import { Comment } from "@prisma/client";
import { Context } from "apollo-server-core";
import {
  ICommentsController,
  ICreateCommentArgs,
  IDeleteCommentArgs,
  IGetAllUserCommentsArgs,
  IGetCommentsArgs,
  IUpdateCommentArgs,
  IUpdateCommentScoreArgs,
} from "../models/comments";
import { IApolloContext } from "../models/context";
import { Direction } from "../models/enums";
import { PAGINATION_LIMIT } from "../utils/constants";
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
  validateGetAllUserComments,
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
   * get all user comments
   */
  public getAllUserComments = async (
    _: unknown,
    args: IGetAllUserCommentsArgs,
    context: Context<IApolloContext>
  ): Promise<Comment[] | null> => {
    validateGetAllUserComments(args);

    return await prisma.comment.findMany({
      where: {
        AND: [{ authorId: args.userId }, { deleted: false }],
      },
      include: {
        author: true,
        commentScores: {
          where: {
            userId: context.currentUser?.id,
          },
        },
        children: {},
        post: {
          include: {
            community: true,
            author: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (args.pageNo ?? 0) * PAGINATION_LIMIT,
      take: PAGINATION_LIMIT,
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
          updatedAt: null,
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

      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: args.postId,
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
          updatedAt: post?.updatedAt ?? null,
        },
      });

      await prisma.user.update({
        where: {
          id: context?.currentUser?.id,
        },
        data: {
          karma: {
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

      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: args.postId,
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
          updatedAt: post?.updatedAt ?? null,
        },
      });

      await prisma.user.update({
        where: {
          id: context?.currentUser?.id,
        },
        data: {
          karma: {
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
        include: {
          author: true,
        },
      });

      const commentScore = await prisma.commentScore.findFirst({
        where: {
          AND: [
            { userId: context.currentUser.id },
            { commentId: args.commentId },
          ],
        },
      });

      const { score: newScore, userKarma } = getScore(
        args,
        comment,
        commentScore,
        comment?.author?.karma
      );

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

      const updatedComment = await prisma.comment.update({
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
            updatedAt: comment?.updatedAt ?? null,
          }),
        },
        include: {
          commentScores: {
            where: {
              userId: context.currentUser.id,
            },
          },
        },
      });

      if (newCommentScoreEntity?.userId !== comment?.authorId) {
        await prisma.user.update({
          where: {
            id: comment?.authorId,
          },
          data: {
            karma: userKarma,
          },
        });
      }

      return updatedComment;
    } catch (error) {
      return handleError(error as Error);
    }
  };
}
