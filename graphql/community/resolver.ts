import CommunityController from "../../controllers/community";

const {
  getAllCommunities,
  getCommunityDetails,
  createCommunity,
  updateCommunity,
  joinCommunity,
  leaveCommunity,
} = new CommunityController();

export const resolver = {
  Query: {
    allCommunities: getAllCommunities,
    getCommunityDetails: getCommunityDetails,
  },

  Mutation: {
    createCommunity: createCommunity,
    updateCommunity: updateCommunity,
    joinCommunity: joinCommunity,
    leaveCommunity: leaveCommunity,
  },
};
