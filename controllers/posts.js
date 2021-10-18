const Post = require("../models/post");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate("user")
    .populate("comments")
    .populate("subreddit");
  res.json(posts);
};

const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user")
    .populate("comments")
    .populate("subreddit");
  res.json(post);
};

const createPost = async (req, res) => {
  const body = req.body;
  const newPost = new Post({
    title: body.title,
    content: body.content,
    subreddit: body.subreddit,
    user: req.user.id,
    createdAt: Date.now(),
  });
  await newPost.save();

  res.json(newPost);
};

const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (post.user.toString() === req.user.id.toString()) {
    res.status(204).end();
  } else {
    res
      .status(401)
      .send({ error: "You are not authorized to delete the post" });
  }
};

const editPost = async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (post.user.toString() === req.user.id.toString()) {
    const body = req.body;
    const data = {
      ...body,
      editedAt: Date.now(),
    };
    const editedPost = await Post.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("user")
      .populate("comments")
      .populate("subreddit");
    res.json(editedPost);
  } else {
    res.status(401).send({ error: "You are not authorized to edit the post" });
  }
};

const handleUpvotes = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { upvotes: body.upvotes, downvotes: body.downvotes },
    { new: true }
  )
    .populate("user")
    .populate("comments")
    .populate("subreddit");
  if (body.hasUpvotedAlready) {
    req.user.postsUpvoted = req.user.postsUpvoted.filter(
      (postId) => postId.toString() !== id
    );
  } else if (body.hasDownvotedAlready) {
    req.user.postsUpvoted = req.user.postsUpvoted.concat(updatedPost.id);
    req.user.postsDownvoted = req.user.postsDownvoted.filter(
      (postId) => postId.toString() !== id
    );
  } else {
    req.user.postsUpvoted = req.user.postsUpvoted.concat(updatedPost.id);
  }

  await req.user.save();
  res.json(updatedPost);
};

const handleDownvotes = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { upvotes: body.upvotes, downvotes: body.downvotes },
    { new: true }
  )
    .populate("user")
    .populate("comments")
    .populate("subreddit");
  if (body.hasDownvotedAlready) {
    req.user.postsDownvoted = req.user.postsDownvoted.filter(
      (postId) => postId.toString() !== id
    );
  } else if (body.hasUpvotedAlready) {
    req.user.postsDownvoted = req.user.postsDownvoted.concat(updatedPost.id);
    req.user.postsUpvoted = req.user.postsUpvoted.filter(
      (postId) => postId.toString() !== id
    );
  } else {
    req.user.postsDownvoted = req.user.postsDownvoted.concat(updatedPost.id);
  }
  await req.user.save();
  res.json(updatedPost);
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost,
  editPost,
  handleUpvotes,
  handleDownvotes,
};
