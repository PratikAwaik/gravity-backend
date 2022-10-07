import PostsController from "../../controllers/posts";

const { getAllPosts, createPost } = new PostsController();

export const resolver = {
  Query: {
    allPosts: getAllPosts,
  },

  Mutation: {
    createPost: createPost,
  },
};
