import prisma from "../lib/prisma";

export const resolvers = {
  Query: {
    links: async () => {
      const links = await prisma.link.findMany({});
      return links;
    },
  },
};
