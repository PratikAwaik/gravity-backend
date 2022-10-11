import { Post } from "@prisma/client";
import { Context } from "apollo-server-core";
import { IApolloContext } from "../models/context";
import { ICreatePostArgs, IPostsController } from "../models/posts";
import { handleAuthenticationError, handleError } from "../utils/errors";
import prisma from "../utils/prisma";
import { validateCreatePostDetails } from "../validations/posts";

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
}
