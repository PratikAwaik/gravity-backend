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

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost
}