import CommunityController from "../../controllers/community";
import prisma from "../../utils/prisma";

export const resolver = {
  Query: {
    allCommunities: CommunityController.getAllCommunities,
  },

  Mutation: {
    createCommunity: CommunityController.createCommunity,
  },
};
