import CommentsController from "../../controllers/comments";

const { getComments, createComment, updateCommentScore } =
  new CommentsController();

export const resolver = {
  Query: {
    allComments: getComments,
  },
  Mutation: {
    createComment: createComment,
    updateCommentScore: updateCommentScore,
  },
};
