import prisma from "../../lib/prisma";

export const resolver = {
  Query: {
    allUsers: async () => {
      return prisma.user.findMany({});
    },
  },
};
