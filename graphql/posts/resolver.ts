import PostsController from "../../controllers/posts";

const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  updatePostScore,
  getPostById,
} = new PostsController();

export const resolver = {
  Query: {
    allPosts: getAllPosts,
    getPostById: getPostById,
  },

  Mutation: {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
    updatePostScore: updatePostScore,
  },
};
