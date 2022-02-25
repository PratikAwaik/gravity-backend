/* GraphQL typeDefs */

const userDef = require("./user");
const subredditDef = require("./subreddit");
const markdownPostDef = require("./markdownPost");
const queryDef = require("./query");
const mutationDef = require("./mutation");

const typeDefs = [userDef, subredditDef, markdownPostDef, queryDef, mutationDef];

module.exports = typeDefs;