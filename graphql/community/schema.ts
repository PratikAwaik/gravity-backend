import {gql} from "apollo-server-core";

export const typeDef = gql`
  input UpdateCommunityPayload {
    communityId: String!
    description: String
    icon: IconPayload
  }

  type Community {
    id: ID!
    name: String!
    prefixedName: String!
    description: String!
    icon: Icon
    adminId: String!
    admin: User!
    posts: [Post]!
    members: [User]
    membersCount: Int!
    createdAt: Float!
    updatedAt: Float
  }

  extend type Query {
    allCommunities: [Community]!
    getCommunityDetails(name: String!): Community
    getSearchCommunities(search: String, pageNo: Int, limit: Int): [Community]
  }

  extend type Mutation {
    createCommunity(name: String!, description: String!): Community!
    updateCommunity(payload: UpdateCommunityPayload): Community!
    joinCommunity(communityId: String!): Community!
    leaveCommunity(communityId: String!): Community!
  }
`;
