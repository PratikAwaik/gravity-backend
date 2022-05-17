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

    createNewSubreddit(
      name: String!
      description: String!
      icon: String
    ): Subreddit
  }
`;

module.exports = Mutation;
