/* GraphQL typeDefs */

const userSchema = require("./user");
const subredditSchema = require("./subreddit");
const markdownPostSchema = require("./markdownPost");
const querySchema = require("./query");

const typeDefs = [userSchema, subredditSchema, markdownPostSchema, querySchema];

module.exports = typeDefs;