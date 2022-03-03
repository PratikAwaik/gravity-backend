/* GraphQL resolvers */

const userResolver = require("./user");
const queryResolver = require("./query");
const mutationResolver = require("./mutation");

const resolvers = {
  Query: queryResolver,
  Mutation: mutationResolver,
  User: userResolver,
};

module.exports = resolvers;
