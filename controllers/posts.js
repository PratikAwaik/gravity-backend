const Post = require('../models/post');

const getAllPosts = async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
}

const getSinglePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
} 

const createPost = async (req, res) => {
  if (req.user) {
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
  } else {
    res.status(401).send({ error: 'Signup or Login to create a post' });
  }
}

const deletePost = async (req, res) => {
  if (req.user) {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() === req.user.id.toString()) {
      await Post.findByIdAndDelete(req.params.id);
      req.user.posts = req.user.posts.filter(postId => postId.toString() !== post.id.toString());
      await req.user.save();
      res.status(204).end();
    } else {
      res.status(401).send({ error: 'You are not authorized to delete the post' });
    }
  } else {
    res.status(401).send({ error: 'Signup or login to delete the post' });
  }
}

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost
}