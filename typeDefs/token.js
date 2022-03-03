const { gql } = require("apollo-server");

const typeDef = gql`
  type Token {
    value: String!
  }
`;

module.exports = typeDef;
