import CommunityController from "../../controllers/community";

const {
  getAllCommunities,
  createCommunity,
  updateCommunity,
  joinCommunity,
  leaveCommunity,
} = new CommunityController();

export const resolver = {
  Query: {
    allCommunities: getAllCommunities,
  },

  Mutation: {
    createCommunity: createCommunity,
    updateCommunity: updateCommunity,
    joinCommunity: joinCommunity,
    leaveCommunity: leaveCommunity,
  },
};
