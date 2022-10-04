import prisma from "../../utils/prisma";

export const resolver = {
  Query: {
    allCommunities: async () => {
      return prisma.community.findMany({});
    },
  },
};
