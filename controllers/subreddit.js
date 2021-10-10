const Subreddit = require("../models/subreddit");

const getAllSubreddits = async (req, res) => {
  const subreddits = await Subreddit.find({});
  res.json(subreddits);
};

const createSubreddit = async (req, res) => {
  const body = req.body;
  const newSubreddit = new Subreddit({
    ...body,
    members: [req.user.id],
    moderators: [req.user.id],
  });

  await newSubreddit.save();
  res.json(newSubreddit);
};

module.exports = {
  getAllSubreddits,
  createSubreddit,
};
