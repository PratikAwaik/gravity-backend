const queryController = require("../controllers/query");

const queryResolver = {
  allUsers: queryController.allUsers,
  allSubreddits: queryController.allSubreddits,
  allMarkdownPosts: queryController.allMarkdownPosts,
};

module.exports = queryResolver;
