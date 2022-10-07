import CommentsController from "../../controllers/comments";

const { getAllComments } = new CommentsController();

export const resolver = {
  Query: {
    allComments: getAllComments,
  },
};
