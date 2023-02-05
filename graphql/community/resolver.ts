import CommunityController from "../../controllers/community";

const {
  getAllCommunities,
  getCommunityDetails,
  createCommunity,
  updateCommunity,
  joinCommunity,
  leaveCommunity,
  getSearchCommunities,
} = new CommunityController();

export const resolver = {
  Query: {
    allCommunities: getAllCommunities,
    getCommunityDetails: getCommunityDetails,
    getSearchCommunities: getSearchCommunities,
  },

  Mutation: {
    createCommunity: createCommunity,
    updateCommunity: updateCommunity,
    joinCommunity: joinCommunity,
    leaveCommunity: leaveCommunity,
  },
};
