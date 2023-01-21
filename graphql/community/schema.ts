import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Community {
    id: ID!
    name: String!
    prefixedName: String!
    description: String!
    icon: String
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
  }

  extend type Mutation {
    createCommunity(name: String!, description: String!): Community!
    updateCommunity(
      communityId: String!
      description: String
      icon: String
    ): Community!
    joinCommunity(communityId: String!): Community!
    leaveCommunity(communityId: String!): Community!
  }
`;
