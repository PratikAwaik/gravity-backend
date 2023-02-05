import CommentsController from "../../controllers/comments";

const {
  getComments,
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
  updateCommentScore,
} = new CommentsController();

export const resolver = {
  Query: {
    allComments: getComments,
    getAllComments: getAllComments,
  },
  Mutation: {
    createComment: createComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    updateCommentScore: updateCommentScore,
  },
};
