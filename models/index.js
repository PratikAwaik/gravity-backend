/* Sequelize Models */
const User = require("./user");
const Subreddit = require("./subreddit");
const MarkdownPost = require("./markdownPost");

User.hasMany(Subreddit);
Subreddit.belongsTo(User, {
  as: "admin",
});

User.hasMany(MarkdownPost);
MarkdownPost.belongsTo(User, {
  as: "author",
});

Subreddit.hasMany(MarkdownPost);
MarkdownPost.belongsTo(Subreddit);

module.exports = {
  User,
  Subreddit,
  MarkdownPost,
};
