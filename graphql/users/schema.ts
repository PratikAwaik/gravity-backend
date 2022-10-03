import { gql } from "apollo-server-core";

export const typeDef = gql`
  type User {
    id: ID!
    username: String!
    prefixedUsername: String!
    email: String!
    password: String!
    profilePic: String
    moderatedCommunities: [Community]!
    joinedCommunities: [Community]!
    posts: [Post]!
    comments: [Comment]!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    allUsers: [User]!
  }
`;
