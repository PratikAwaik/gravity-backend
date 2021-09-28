const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

const getAllComments = async (req, res) => {
  const id = req.params.id;
  const comments = await Comment.find({ post: id })
    .populate("user")
    .populate("repliedTo");
  res.json(comments);
};

const createComment = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  const body = req.body;
  const newComment = new Comment({
    content: body.content,
    post: id,
    user: req.user.id,
    repliedTo: body.commentId ? body.commentId : null,
    createdAt: Date.now(),
  });
  await newComment.save();

  const post = await Post.findById(id);
  post.comments = post.comments.concat(newComment);
  post.save();
  res.json(newComment);
};

module.exports = {
  getAllComments,
  createComment,
};
