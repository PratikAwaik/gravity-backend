const { gql } = require("apollo-server");

const Mutation = gql`
  type Mutation {
    createNewUser(
      username: String!
      email: String!
      password: String!
      icon: String
    ): User
    loginUser(username: String!, password: String!): Token
  }
`;

module.exports = Mutation;
