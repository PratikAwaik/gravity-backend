const { gql } = require("apollo-server");

const Query = gql`
    type Query {
        allUsers: [User!]!
        allSubreddits: [Subreddit!]!
        allMarkdownPosts: [MarkdownPost!]!
    }
`;

module.exports = Query;