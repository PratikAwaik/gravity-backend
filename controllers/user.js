const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { paginateResults } = require("../utils/helpers");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else res.status(404).send({ error: "User not found!" });
};

const getSubreddits = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("subscriptions", [
      "prefixedName",
      "communityIcon",
      "members",
      "coverColor",
    ])
    .populate("moderating", [
      "prefixedName",
      "communityIcon",
      "members",
      "coverColor",
    ]);
  if (user) {
    res.json({
      subscriptions: user.subscriptions,
      moderating: user.moderating,
    });
  } else {
    res
      .status(404)
      .send({ error: "Cannot get subreddits for non-existent user!" });
  }
};

const getPosts = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const user = await User.findById(req.params.id)
    .populate({
      path: "posts",
      populate: {
        path: "user",
        model: "User",
        select: "prefixedName",
      },
    })
    .populate({
      path: "posts",
      populate: {
        path: "subreddit",
        model: "Subreddit",
        select: "prefixedName communityIcon",
      },
    });

  if (user) {
    res.json(paginateResults(page, limit, user.posts));
  } else {
    res.status(404).send({ error: "Cannot get posts for non-existent user!" });
  }
};

const getComments = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const user = await User.findById(req.params.id).populate({
    path: "comments",
    populate: {
      path: "user",
      model: "User",
      select: "username profilePic",
    },
  });

  if (user) {
    res.json(paginateResults(page, limit, user.comments));
  } else {
    res
      .status(404)
      .send({ error: "Cannot get comments for non-existent user!" });
  }
};

const registerUser = async (req, res) => {
  const body = req.body;
  const passwordHash = await bcrypt.hash(body.password, 10);
  const newUser = new User({
    username: body.username,
    prefixedName: "u/" + body.username,
    email: body.email,
    profilePic: body.profilePic,
    passwordHash,
    createdAt: Date.now(),
  });
  await newUser.save();

  const userForToken = {
    username: newUser.username,
    id: newUser.id,
  };
  const token = jwt.sign(userForToken, process.env.JWT_SECRET);
  res.json({ token, ...userForToken });
};

const loginUser = async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ username: body.username });
  const isPasswordCorrect = user
    ? await bcrypt.compare(body.password, user.passwordHash)
    : false;

  if (!isPasswordCorrect) {
    res.status(400).send({ error: "Invalid username or password" });
  }
  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, process.env.JWT_SECRET);
  res.json({ token, ...userForToken });
};

const updateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).end();
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getSubreddits,
  getPosts,
  getComments,
  registerUser,
  loginUser,
  updateUser,
};
