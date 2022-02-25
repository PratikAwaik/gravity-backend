const { gql } = require("apollo-server");

const typeDef = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        icon: String
    }
`;

module.exports = typeDef;