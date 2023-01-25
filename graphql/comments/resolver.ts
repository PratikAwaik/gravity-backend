import CommentsController from "../../controllers/comments";

const {
  getComments,
  getAllUserComments,
  createComment,
  updateComment,
  deleteComment,
  updateCommentScore,
} = new CommentsController();

export const resolver = {
  Query: {
    allComments: getComments,
    getAllUserComments: getAllUserComments,
  },
  Mutation: {
    createComment: createComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    updateCommentScore: updateCommentScore,
  },
};
