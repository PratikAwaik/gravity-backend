import { Post } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "../models/context";
import { Direction, PostType } from "../models/enums";
import {
  ICreatePostArgs,
  IDeletePostArgs,
  IGetAllPostArgs,
  IGetPostByIdArgs,
  IPostsController,
  IUpdatePostArgs,
  IUpdatePostScoreArgs,
} from "../models/posts";
import cloudinary from "../utils/cloudinary";
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
import ogs from "open-graph-scraper";
import { PAGINATION_LIMIT } from "../utils/constants";

export default class PostsController implements IPostsController {
  /**
   * get all posts
   */
  public getAllPosts = async (
    _: unknown,
    args: IGetAllPostArgs,
    context: Context<IApolloContext>
  ): Promise<Post[]> => {
    return await prisma.post.findMany({
      where: {
        communityId: args.communityId,
        authorId: args.userId,
      },
      include: {
        author: true,
        community: {
          include: {
            members: {
              where: {
                id: context?.currentUser?.id,
              },
            },
            admin: true,
          },
        },
        postScores: {
          where: {
            userId: context.currentUser?.id,
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
   * get post by id
   */
  public getPostById = (
    _: unknown,
    args: IGetPostByIdArgs,
    context: Context<IApolloContext>
  ): Promise<Post | Error> => {
    const postId = args.postId;
    const post = prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: true,
        community: true,
        ...(context?.currentUser?.id && {
          postScores: {
            where: {
              userId: context?.currentUser?.id ?? null,
            },
          },
        }),
      },
    });

    return post;
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

    let mediaPayload: {
      content: string;
      mediaType: any;
    } = {
      content: "",
      mediaType: null,
    };

    let articleImage;

    try {
      if (args.type === PostType.MEDIA) {
        const uploadedMedia = await cloudinary.uploader.upload(args.content, {
          upload_prest: process.env.CLOUDINARY_UPLOAD_PRESET,
          folder: "gravityuploads",
          resource_type: "auto",
        });
        mediaPayload.content = uploadedMedia.secure_url;
        mediaPayload.mediaType = uploadedMedia.resource_type;
      } else if (args.type === PostType.ARTICLE) {
        const options = {
          url: args.content,
        };
        const { result } = await ogs(options);
        articleImage = (result as any).ogImage?.url;
      }

      const post = await prisma.post.create({
        data: {
          title: args.title,
          content:
            args.type === PostType.MEDIA ? mediaPayload.content : args.content,
          authorId: context?.currentUser?.id,
          type: args.type,
          mediaType:
            args.type === PostType.MEDIA
              ? mediaPayload.mediaType
              : args.mediaType,
          communityId: args.communityId,
          articleImage: articleImage,
          updatedAt: null,
        },
        include: {
          author: true,
          community: true,
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

      const deletedPost = await prisma.post.update({
        where: {
          id: args.postId,
        },
        data: {
          deleted: true,
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

      return deletedPost;
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
        include: {
          author: true,
        },
      });

      const postScore = await prisma.postScore.findFirst({
        where: {
          AND: [{ userId: context.currentUser.id }, { postId: args.postId }],
        },
      });

      const { score: newScore, userKarma } = getScore(
        args,
        post,
        postScore,
        post?.author?.karma
      );

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

      const updatedPost = await prisma.post.update({
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
          updatedAt: post?.updatedAt ?? null,
        },
        include: {
          postScores: {
            where: {
              userId: context.currentUser.id,
            },
          },
        },
      });

      if (newPostScoreEntity?.userId !== post?.authorId) {
        await prisma.user.update({
          where: {
            id: post?.authorId,
          },
          data: {
            karma: userKarma,
          },
        });
      }
      return updatedPost;
    } catch (error) {
      return handleError(error as Error);
    }
  };
}
