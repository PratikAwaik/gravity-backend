const Post = require('../models/post');

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate('user');
  res.json(posts);
}

const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user');
  res.json(post);
} 

const createPost = async (req, res) => {
  const body = req.body;
  const newPost = new Post({
    title: body.title,
    content: body.content,
    type: body.type,
    user: req.user.id
  });
  await newPost.save();
  req.user.posts = req.user.posts.concat(newPost);
  await req.user.save();
  res.json(newPost);
}

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.user.toString() === req.user.id.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    req.user.posts = req.user.posts.filter(postId => postId.toString() !== post.id.toString());
    req.user.postsUpvoted = req.user.postsUpvoted.filter(postId => postId.toString() !== post.id.toString());
    req.user.postsDownvoted = req.user.postsDownvoted.filter(postId => postId.toString() !== post.id.toString());
    await req.user.save();
    res.status(204).end();
  } else {
    res.status(401).send({ error: 'You are not authorized to delete the post' });
  }
}

const handleUpvotes = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const updatedPost = await Post.findByIdAndUpdate(id, { upvotes: body.upvotes, downvotes: body.downvotes }, { new: true }).populate('user');
  if (body.hasUpvotedAlready) {
    req.user.postsUpvoted = req.user.postsUpvoted.filter(postId => postId.toString() !== id);
  } else if (body.hasDownvotedAlready) {
    req.user.postsUpvoted = req.user.postsUpvoted.concat(updatedPost.id);
    req.user.postsDownvoted = req.user.postsDownvoted.filter(postId => postId.toString() !== id);
  } else {
    req.user.postsUpvoted = req.user.postsUpvoted.concat(updatedPost.id);
  }
  await req.user.save();
  res.json(updatedPost);
}

const handleDownvotes = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const updatedPost = await Post.findByIdAndUpdate(id, { upvotes: body.upvotes, downvotes: body.downvotes }, { new: true }).populate('user');
  if (body.hasDownvotedAlready) {
    req.user.postsDownvoted = req.user.postsDownvoted.filter(postId => postId.toString() !== id);
  } else if (body.hasUpvotedAlready) {
    req.user.postsDownvoted = req.user.postsDownvoted.concat(updatedPost.id);
    req.user.postsUpvoted = req.user.postsUpvoted.filter(postId => postId.toString() !== id);
  } else {
    req.user.postsDownvoted = req.user.postsDownvoted.concat(updatedPost.id);
  }
  await req.user.save();
  res.json(updatedPost);
}

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost,
  handleUpvotes,
  handleDownvotes
}