import { Post } from "@prisma/client";
import { Context, UserInputError } from "apollo-server-core";
import { IApolloContext } from "../models/context";
import {
  ICreatePostArgs,
  IPostsController,
  IUpdatePostScoreArgs,
} from "../models/posts";
import {
  handleAuthenticationError,
  handleError,
  throwError,
} from "../utils/errors";
import prisma from "../utils/prisma";
import {
  validateCreatePostDetails,
  validateUpdatePostScore,
} from "../validations/posts";

export default class PostsController implements IPostsController {
  /**
   * get all posts
   */
  public getAllPosts = async (): Promise<Post[]> => {
    return await prisma.post.findMany({
      include: {
        author: true,
        community: true,
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
  ): Promise<Post | void> => {
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
      });
      return post;
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * update score
   */
  public updatePostScore = async (
    _: unknown,
    args: IUpdatePostScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Post> => {
    handleAuthenticationError(context);
    validateUpdatePostScore(args);

    try {
      let newScore;
      let newPostScore;
      const post = await prisma.post.findUnique({
        where: {
          id: args.postId,
        },
      });

      if (!post) {
        throwError(UserInputError, "Post Not Found");
      }

      const postScore = await prisma.postScore.findFirst({
        where: {
          AND: [{ postId: args.postId }, { userId: context.currentUser.id }],
        },
      });

      if (!postScore) {
        if (args.direction === 1) {
          // upvote
          newScore = (post?.score ?? 0) + 1;
        } else if (args.direction === -1) {
          // downvote
          newScore = (post?.score ?? 0) - 1;
        }

        newPostScore = await prisma.postScore.create({
          data: {
            postId: args.postId,
            userId: context.currentUser.id,
            direction: args.direction,
          },
        });
      } else {
        if (postScore.direction === 0 && args.direction === 1) {
          // upvote
          newScore = (post?.score ?? 0) + 1;
        } else if (postScore.direction === 0 && args.direction === -1) {
          // downvote
          newScore = (post?.score ?? 0) - 1;
        } else if (postScore.direction === 1 && args.direction === 0) {
          // unvote
          newScore = (post?.score ?? 0) - 1;
        } else if (postScore.direction === 1 && args.direction === -1) {
          // downvote
          newScore = (post?.score ?? 0) - 2;
        } else if (postScore.direction === -1 && args.direction === 0) {
          // unvote
          newScore = (post?.score ?? 0) + 1;
        } else if (postScore.direction === -1 && args.direction === 1) {
          // upvote
          newScore = (post?.score ?? 0) + 2;
        }

        newPostScore = await prisma.postScore.update({
          where: { id: postScore.id },
          data: {
            direction: args.direction,
          },
        });
      }

      return await prisma.post.update({
        where: { id: args.postId },
        data: {
          score: newScore,
          postScores: {
            connect: {
              id: newPostScore.id,
            },
          },
        },
        include: {
          postScores: true,
        },
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
