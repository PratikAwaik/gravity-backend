import PostsController from "../../controllers/posts";

const { getAllPosts, createPost, updatePostScore } = new PostsController();

export const resolver = {
  Query: {
    allPosts: getAllPosts,
  },

  Mutation: {
    createPost: createPost,
    updatePostScore: updatePostScore,
  },
};
