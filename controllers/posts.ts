import { Post, PostScore } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "../models/context";
import { Direction } from "../models/enums";
import {
  ICreatePostArgs,
  IDeletePostArgs,
  IPostsController,
  IUpdatePostArgs,
  IUpdatePostScoreArgs,
} from "../models/posts";
import {
  handleAuthenticationError,
  handleError,
  throwForbiddenError,
} from "../utils/errors";
import { getScore } from "../utils/helpers";
import prisma from "../utils/prisma";
import {
  validateCreatePostDetails,
  validateDeletePostArgs,
  validateUpdatePostArgs,
  validateUpdatePostScore,
} from "../validations/posts";

export default class PostsController implements IPostsController {
  /**
   * get all posts
   */
  public getAllPosts = async (
    _: unknown,
    __: unknown,
    context: Context<IApolloContext>
  ): Promise<Post[]> => {
    return await prisma.post.findMany({
      include: {
        author: true,
        community: true,
        postScores: {
          where: {
            userId: context.currentUser?.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  /**
   * create a post
   */
  public createPost = async (
    _: unknown,
    args: ICreatePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error> => {
    handleAuthenticationError(context);
    validateCreatePostDetails(args);

    try {
      const post = await prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          authorId: context.currentUser.id,
          type: args.type,
          communityId: args.communityId,
        },
        include: {
          author: true,
          community: true,
        },
      });

      return post;
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * update post
   */
  public updatePost = async (
    _: unknown,
    args: IUpdatePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error> => {
    handleAuthenticationError(context);
    validateUpdatePostArgs(args);

    try {
      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: args.postId,
        },
      });

      if (post.authorId !== context.currentUser.id) {
        throwForbiddenError();
      }

      return await prisma.post.update({
        where: {
          id: args.postId,
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
   * delete post
   */
  public deletePost = async (
    _: unknown,
    args: IDeletePostArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error> => {
    handleAuthenticationError(context);
    validateDeletePostArgs(args);

    try {
      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: args.postId,
        },
      });

      if (post.authorId !== context.currentUser.id) {
        throwForbiddenError();
      }

      return await prisma.post.update({
        where: {
          id: args.postId,
        },
        data: {
          deleted: true,
        },
      });
    } catch (error) {
      return handleError(error as Error);
    }
  };

  /**
   * update post score
   */
  public updatePostScore = async (
    _: unknown,
    args: IUpdatePostScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error> => {
    handleAuthenticationError(context);
    validateUpdatePostScore(args);

    try {
      let newPostScoreEntity;
      const post = await prisma.post.findUniqueOrThrow({
        where: {
          id: args.postId,
        },
      });

      const postScore = await prisma.postScore.findFirst({
        where: {
          AND: [{ userId: context.currentUser.id }, { postId: args.postId }],
        },
      });

      const newScore = getScore(args, post, postScore);

      // delete record if unvoting
      if (args.direction === Direction.UNVOTE && postScore?.id) {
        await prisma.postScore.delete({
          where: {
            id: postScore?.id,
          },
        });
      } else if (args.direction !== Direction.UNVOTE) {
        // create or update the record if it exists
        newPostScoreEntity = await prisma.postScore.upsert({
          create: {
            userId: context.currentUser.id,
            postId: args.postId,
            direction: args.direction,
          },
          update: {
            direction: args.direction,
          },
          where: {
            id: postScore?.id || "",
          },
        });
      }

      return await prisma.post.update({
        where: { id: args.postId },
        data: {
          score: newScore,
          ...(args.direction !== Direction.UNVOTE && {
            postScores: {
              connect: {
                id: newPostScoreEntity?.id,
              },
            },
          }),
        },
        include: {
          postScores: {
            where: {
              userId: context.currentUser.id,
            },
          },
        },
      });
    } catch (error) {
      return handleError(error as Error);
    }
  };
}
