import prisma from "../../lib/prisma";

export const resolver = {
  Query: {
    allComments: async () => {
      return prisma.comment.findMany({});
    },
  },
};
