const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).populate([
    "subscriptions",
    "moderating",
    "posts",
    "comments",
    "postsUpvoted",
    "postsDownvoted",
    "commentsUpvoted",
    "commentsDownvoted",
  ]);
  res.json(users);
};

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate([
    "subscriptions",
    "moderating",
    "posts",
    "comments",
    "postsUpvoted",
    "postsDownvoted",
    "commentsUpvoted",
    "commentsDownvoted",
  ]);
  res.json(user);
};

const registerUser = async (req, res) => {
  const body = req.body;
  const passwordHash = await bcrypt.hash(body.password, 10);
  const newUser = new User({
    username: body.username,
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

module.exports = {
  getAllUsers,
  getSingleUser,
  registerUser,
  loginUser,
};
