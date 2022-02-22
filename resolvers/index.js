/* GraphQL resolvers */

const userResolver = require("./user");
const queryResolver = require("./query");

const resolvers = {
    Query: queryResolver,
    User: userResolver,
}

module.exports = resolvers;