import CommentsController from "../../controllers/comments";

const { getComments, createComment } = new CommentsController();

export const resolver = {
  Query: {
    allComments: getComments,
  },
  Mutation: {
    createComment: createComment,
  },
};
