/* Sequelize Models */
const User = require("./user");
const Subreddit = require("./subreddit");
const Post = require("./post");

User.hasMany(Subreddit, { foreignKey: "adminId" });
Subreddit.belongsTo(User, { as: "admin" });

User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, {
  as: "author",
});

Subreddit.hasMany(Post);
Post.belongsTo(Subreddit);

module.exports = {
  User,
  Subreddit,
  Post,
};
