const { gql } = require("apollo-server");

const typeDef = gql`
  type Subreddit {
    id: ID!
    name: String!
    prefixedName: String!
    description: String!
    icon: String
    admin: User!
    createdAt: String!
    updatedAt: String
  }
`;

module.exports = typeDef;
