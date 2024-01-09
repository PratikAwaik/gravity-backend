import {gql} from "apollo-server-core";

export const typeDef = gql`
  type CommunityIcon {
    url: String
    publicId: String
  }

  input CommunityIconPayload {
    content: String
    publicId: String
  }

  # input UpdateCommunityPayload {
  #   communityId: String!
  #   description: String
  #   icon: CommunityIconPayload
  # }

  type Community {
    id: ID!
    name: String!
    prefixedName: String!
    description: String!
    icon: CommunityIcon
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
    updateCommunity(
      communityId: String!
      description: String
      icon: CommunityIconPayload
    ): Community!
    joinCommunity(communityId: String!): Community!
    leaveCommunity(communityId: String!): Community!
  }
`;
