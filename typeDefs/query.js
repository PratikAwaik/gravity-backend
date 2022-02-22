const { gql } = require("apollo-server");

const Query = gql`
    type Query {
        allUsers: [User!]!
    }
`;

module.exports = Query;