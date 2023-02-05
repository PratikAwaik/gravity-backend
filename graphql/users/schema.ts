import { gql } from "apollo-server-core";

export const typeDef = gql`
  type Token {
    value: String!
  }

  type User {
    id: ID!
    username: String!
    prefixedName: String!
    email: String!
    password: String!
    profilePic: String
    moderatedCommunities: [Community]!
    joinedCommunities: [Community]!
    posts: [Post]!
    comments: [Comment]!
    karma: Int!
    createdAt: Float!
    updatedAt: Float
    token: Token
  }

  extend type Query {
    getAllUsers(search: String, pageNo: Int): [User]!
    userSubscriptions: [Community]!
    getUserDetails(username: String!): User
  }

  extend type Mutation {
    registerUser(username: String!, email: String!, password: String!): User!
    loginUser(username: String!, password: String!): User!
    updateLoggedInUser(profilePic: String!): User!
  }
`;
