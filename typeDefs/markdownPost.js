const { gql } = require("apollo-server");

const typeDef = gql`
    type MarkdownPost {
        id: ID!
        title: String!
        content: String!
        author: User!
        subreddit: Subreddit!
    }
`;

module.exports = typeDef;