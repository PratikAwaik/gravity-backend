const { gql } = require("apollo-server");

const typeDef = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    profilePic: String
    createdAt: String!
    updatedAt: String
    token: Token
  }
`;

module.exports = typeDef;
