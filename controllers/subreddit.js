const Subreddit = require("../models/subreddit");

const getAllSubreddits = async (req, res) => {
  const subreddits = await Subreddit.find({});
  res.json(subreddits);
};

const getSingleSubreddit = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id);
  res.json(subreddit);
};

const createSubreddit = async (req, res) => {
  const body = req.body;
  const newSubreddit = new Subreddit({
    ...body,
    name: "r/" + body.name,
    communityIcon: body.image,
    members: [req.user.id],
    moderators: [req.user.id],
  });

  await newSubreddit.save();
  res.json(newSubreddit);
};

module.exports = {
  getAllSubreddits,
  getSingleSubreddit,
  createSubreddit,
};
