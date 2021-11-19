const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const { filteredArray, paginateResults } = require("../utils/helpers");

const getAllSubreddits = async (req, res) => {
  const subreddits = await Subreddit.find({});
  res.json(subreddits);
};

const getSingleSubreddit = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id);
  if (subreddit) res.json(subreddit);
  else res.status(404).send({ error: "Subreddit not found!" });
};

const getSingleSubredditPosts = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const subreddit = await Subreddit.findById(req.params.id).populate({
    path: "posts",
    populate: {
      path: "user",
      model: "User",
      select: "prefixedName",
    },
  });
  if (subreddit) {
    res.json(paginateResults(page, limit, subreddit.posts));
  } else {
    res
      .status(404)
      .send({ error: "Cannot get posts for non-existent subreddit!" });
  }
};

const getSingleSubredditMembersAndModerators = async (req, res) => {
  const subreddit = await Subreddit.findById(req.params.id)
    .populate("members", ["prefixedName", "profilePic"])
    .populate("moderators", ["prefixedName", "profilePic"]);

  if (subreddit) {
    res.json({
      members: subreddit.members,
      moderators: subreddit.moderators,
    });
  } else {
    res.status(404).send({
      error: "Cannot get members and moderators for non-existent members!",
    });
  }
};

const getSearchSubreddits = async (req, res) => {
  const searchString = req.query.search;

  const subreddits = await Subreddit.find({
    name: { $regex: searchString, $options: "i" },
  });
  res.json(subreddits);
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
    communityIcon: body.communityIcon,
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
    subreddit.membersCount = subreddit.membersCount + 1;
    req.user.subscriptions = req.user.subscriptions.concat(req.params.id);
  } else {
    subreddit.members = filteredArray(subreddit.members, req.user.id);
    subreddit.membersCount = subreddit.membersCount - 1;
    req.user.subscriptions = filteredArray(
      req.user.subscriptions,
      req.params.id
    );
  }
  await Subreddit.findByIdAndUpdate(req.params.id, {
    members: subreddit.members,
    membersCount: subreddit.membersCount,
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
  getSearchSubreddits,
  createSubreddit,
  handleUserSubscription,
  updateSubreddit,
};
