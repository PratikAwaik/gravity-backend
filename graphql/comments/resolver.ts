import prisma from "../../utils/prisma";

export const resolver = {
  Query: {
    allComments: async () => {
      return prisma.comment.findMany({});
    },
  },
};
