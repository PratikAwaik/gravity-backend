import prisma from "../../utils/prisma";

export const resolver = {
  Query: {
    allPosts: async () => {
      return prisma.post.findMany({});
    },
  },
};
