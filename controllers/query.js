const { User, Subreddit, MarkdownPost } = require("../models");

const allUsers = () => {
  return User.findAll();
};

const allSubreddits = async () => {
  const subreddits = await Subreddit.findAll({
    include: {
      model: User,
      as: "admin",
      attributes: { exclude: ["markdownPostId"] },
    },
    attributes: {
      exclude: ["userId", "markdownPostId"],
    },
  });
  return subreddits;
};

const allMarkdownPosts = async () => {
  const posts = await MarkdownPost.findAll({
    include: [
      {
        model: User,
        as: "author",
      },
      {
        model: Subreddit,
        attributes: { exclude: ["userId"] },
      },
    ],
    attributes: { exclude: ["userId"] },
  });
  return posts;
};

module.exports = {
  allUsers,
  allSubreddits,
  allMarkdownPosts,
};
