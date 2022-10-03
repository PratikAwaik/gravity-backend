import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Community {
    id: ID!
    name: String!
    prefixedName: String!
    description: String!
    icon: String
    adminId: String!
    posts: [Post]!
    members: [User]!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    allCommunities: [Community]!
  }
`;
