import CommunityController from "../../controllers/community";

const { getAllCommunities, createCommunity, updateCommunity } =
  new CommunityController();

export const resolver = {
  Query: {
    allCommunities: getAllCommunities,
  },

  Mutation: {
    createCommunity: createCommunity,
    updateCommunity: updateCommunity,
  },
};
