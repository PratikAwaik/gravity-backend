import CommunityController from "../../controllers/community";

const { getAllCommunities, createCommunity } = new CommunityController();

export const resolver = {
  Query: {
    allCommunities: getAllCommunities,
  },

  Mutation: {
    createCommunity: createCommunity,
  },
};
