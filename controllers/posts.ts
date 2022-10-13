import { Post, PostScore } from "@prisma/client";
import { Context, UserInputError } from "apollo-server-core";
import { IApolloContext } from "../models/context";
import { Direction } from "../models/enums";
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
import { getScore } from "../utils/helpers";
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
   * update post score
   */
  public updatePostScore = async (
    _: unknown,
    args: IUpdatePostScoreArgs,
    context: Context<IApolloContext>
  ): Promise<Post> => {
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
          postScores: true,
        },
      });
    } catch (error) {
      return handleError(error);
    }
  };
}
