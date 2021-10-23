const Subreddit = require("../models/subreddit");

const getAllSubreddits = async (req, res) => {
  const subreddits = await Subreddit.find({});
  res.json(subreddits);
};

const getSingleSubreddit = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id);
  res.json(subreddit);
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const createSubreddit = async (req, res) => {
  const body = req.body;
  const newSubreddit = new Subreddit({
    ...body,
    name: "r/" + body.name,
    communityIcon: body.image,
    members: [req.user.id],
    moderators: [req.user.id],
    coverColor: getRandomColor(),
  });

  await newSubreddit.save();
  res.json(newSubreddit);
};

module.exports = {
  getAllSubreddits,
  getSingleSubreddit,
  createSubreddit,
};
