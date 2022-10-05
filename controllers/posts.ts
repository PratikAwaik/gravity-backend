import { handleAuthenticationError, handleError } from "../utils/errors";
import prisma from "../utils/prisma";
import { validateCreatePostDetails } from "../validations/posts";

export default class PostsController {
  static getAllPosts = async () => {
    return await prisma.post.findMany({
      include: {
        author: true,
        community: true,
      },
    });
  };

  static createPost = async (_: any, args: any, context: any) => {
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
      handleError(error);
    }
  };
}
