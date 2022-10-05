import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Token {
    value: String!
  }

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
    token: Token
  }

  extend type Query {
    allUsers: [User]!
  }

  extend type Mutation {
    registerUser(username: String!, email: String!, password: String!): User
    loginUser(username: String!, password: String!): User
  }
`;