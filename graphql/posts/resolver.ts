import PostsController from "../../controllers/posts";

const { getAllPosts, createPost, updatePost, deletePost, updatePostScore } =
  new PostsController();

export const resolver = {
  Query: {
    allPosts: getAllPosts,
  },

  Mutation: {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
    updatePostScore: updatePostScore,
  },
};
