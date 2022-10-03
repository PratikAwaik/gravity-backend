import prisma from "../../lib/prisma";

export const resolver = {
  Query: {
    allCommunities: async () => {
      return prisma.community.findMany({});
    },
  },
};
