/* GraphQL typeDefs */

const userSchema = require("./user");
const querySchema = require("./query");

const typeDefs = [userSchema, querySchema];

module.exports = typeDefs;