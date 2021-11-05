const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const { filteredArray } = require("../utils/helpers");

const getAllSubreddits = async (req, res) => {
  const subreddits = await Subreddit.find({});
  res.json(subreddits);
};

const getSingleSubreddit = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id);
  res.json(subreddit);
};

const getSingleSubredditPosts = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id).populate({
    path: "posts",
    populate: {
      path: "user",
      model: "User",
    },
  });
  res.json({ posts: subreddit.posts });
};

const getSingleSubredditMembersAndModerators = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id).populate([
    "members",
    "moderators",
  ]);
  res.json({ members: subreddit.members, moderators: subreddit.moderators });
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const createSubreddit = async (req, res) => {
  const body = req.body;
  const newSubreddit = new Subreddit({
    ...body,
    name: body.name,
    prefixedName: "r/" + body.name,
    communityIcon: body.image,
    members: [req.user.id],
    moderators: [req.user.id],
    coverColor: getRandomColor(),
  });

  await newSubreddit.save();
  res.json(newSubreddit);
};

const handleUserSubscription = async (req, res) => {
  const { subscribe } = req.body;
  const subreddit = await Subreddit.findById(req.params.id);
  if (subscribe) {
    subreddit.members = subreddit.members.concat(req.user.id);
    req.user.subscriptions = req.user.subscriptions.concat(req.params.id);
  } else {
    subreddit.members = filteredArray(subreddit.members, req.user.id);
    subreddit.moderators = filteredArray(subreddit.moderators, req.user.id);
    req.user.subscriptions = filteredArray(req.user.subscriptions, req.user.id);
    req.user.moderating = filteredArray(req.user.moderating, req.user.id);
  }
  await Subreddit.findByIdAndUpdate(req.params.id, {
    members: subreddit.members,
  });
  await User.findByIdAndUpdate(req.user.id, {
    subscriptions: req.user.subscriptions,
  });
  res.status(200).end();
};

const updateSubreddit = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id);
  if (subreddit.moderators.includes(req.user.id)) {
    await Subreddit.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).end();
  } else {
    res
      .status(401)
      .send({ error: "Only moderators can update the subreddit." });
  }
};

module.exports = {
  getAllSubreddits,
  getSingleSubreddit,
  getSingleSubredditPosts,
  getSingleSubredditMembersAndModerators,
  createSubreddit,
  handleUserSubscription,
  updateSubreddit,
};
