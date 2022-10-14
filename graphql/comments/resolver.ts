import CommentsController from "../../controllers/comments";

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  updateCommentScore,
} = new CommentsController();

export const resolver = {
  Query: {
    allComments: getComments,
  },
  Mutation: {
    createComment: createComment,
    updateComment: updateComment,
    deleteComment: deleteComment,
    updateCommentScore: updateCommentScore,
  },
};
