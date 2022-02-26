/* GraphQL typeDefs */

const userDef = require("./user");
const subredditDef = require("./subreddit");
const markdownPostDef = require("./markdownPost");
const queryDef = require("./query");
const mutationDef = require("./mutation");
const tokenDef = require("./token");

const typeDefs = [
    userDef, 
    subredditDef, 
    markdownPostDef, 
    tokenDef, 
    queryDef, 
    mutationDef
];

module.exports = typeDefs;