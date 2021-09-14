const asyncPkg = require('async');
const Post = require('../models/post');

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate('user');
  res.json(posts);
}

const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
} 

const createPost = async (req, res) => {
  const body = req.body;
  const newPost = new Post({
    title: body.title,
    content: body.content,
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
    await req.user.save();
    res.status(204).end();
  } else {
    res.status(401).send({ error: 'You are not authorized to delete the post' });
  }
}

const handleUpvotes = async (req, res) => {
  await handleVotes(req.params.id, req.user, res, true);
}

const handleDownvotes = async (req, res) => {
  await handleVotes(req.params.id, req.user, res, false);
}

const handleVotes = async (id, user, res, upvote) => {
  const post = await Post.findById(id);
  let updatedPost;
  if (upvote) {
    if (user.postsUpvoted.find(postId => postId.toString() === post.id.toString())) {
      updatedPost = await Post.findByIdAndUpdate(post.id, { upvotes: post.upvotes - 1 }, { new: true });    
      user.postsUpvoted = user.postsUpvoted.filter(postId => postId.toString() !== updatedPost.id.toString());
      await user.save();
      res.json(updatedPost);
    } else {
      updatedPost = await Post.findByIdAndUpdate(post.id, { upvotes: post.upvotes + 1 }, { new: true });
      user.postsUpvoted = user.postsUpvoted.concat(updatedPost.id);
      if (user.postsDownvoted.find(postId => postId.toString() === post.id.toString())) {
        updatedPost = await Post.findByIdAndUpdate(post.id, { downvotes: post.downvotes - 1 }, { new: true });
        user.postsDownvoted = user.postsDownvoted.filter(postId => postId.toString() !== updatedPost.id);
      }
      await user.save();
      res.json(updatedPost);
    }
  } else {
    if (user.postsDownvoted.find(postId => postId.toString() === post.id.toString())) {
      updatedPost = await Post.findByIdAndUpdate(post.id, { downvotes: post.downvotes - 1 }, { new: true });    
      user.postsDownvoted = user.postsDownvoted.filter(postId => postId.toString() !== updatedPost.id.toString());
      await user.save();
      res.json(updatedPost);
    } else {
      updatedPost = await Post.findByIdAndUpdate(post.id, { downvotes: post.downvotes + 1 }, { new: true });
      user.postsDownvoted = user.postsDownvoted.concat(updatedPost.id);
      if (user.postsUpvoted.find(postId => postId.toString() === post.id.toString())) {
        updatedPost = await Post.findByIdAndUpdate(post.id, { upvotes: post.upvotes - 1 }, { new: true });
        user.postsUpvoted = user.postsUpvoted.filter(postId => postId.toString() !== updatedPost.id);
      }
      await user.save();
      res.json(updatedPost);
    }
  }
}

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost,
  handleUpvotes,
  handleDownvotes
}