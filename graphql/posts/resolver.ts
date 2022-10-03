import prisma from "../../lib/prisma";

export const resolver = {
  Query: {
    allPosts: async () => {
      return prisma.post.findMany({});
    },
  },
};
