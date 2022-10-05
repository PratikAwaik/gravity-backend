import PostsController from "../../controllers/posts";
import prisma from "../../utils/prisma";

export const resolver = {
  Query: {
    allPosts: PostsController.getAllPosts,
  },

  Mutation: {
    createPost: PostsController.createPost,
  },
};
