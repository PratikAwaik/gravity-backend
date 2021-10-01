const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

const getAllComments = async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId })
    .populate("user")
    .populate("repliedTo");
  res.json(comments);
};

const createComment = async (req, res) => {
  const postId = req.params.id;
  const body = req.body;
  const newComment = new Comment({
    content: body.content,
    post: mongoose.Types.ObjectId(postId),
    user: req.user.id,
    repliedTo: body.repliedTo ? body.repliedTo : null,
    createdAt: Date.now(),
  });
  await newComment.save();
  const populatedComment = await newComment
    .populate("user")
    .populate("repliedTo");

  const post = await Post.findById(postId);
  post.comments = post.comments.concat(newComment);
  post.save();

  req.user.comments = req.user.comments.concat(newComment.id);
  req.user.save();
  res.json(populatedComment);
};

const upvoteComment = async (req, res) => {
  const body = req.body;
  const commentId = req.params.commentId;

  if (body.hasUpvotedAlready) {
    req.user.commentsUpvoted = req.user.commentsUpvoted.filter(
      (id) => id.toString() !== commentId
    );
  } else if (body.hasDownvotedAlready) {
    req.user.commentsUpvoted = req.user.commentsUpvoted.concat(commentId);
    req.user.commentsDownvoted = req.user.commentsDownvoted.filter(
      (id) => id.toString() !== commentId
    );
  } else {
    req.user.commentsUpvoted = req.user.commentsUpvoted.concat(commentId);
  }
  await req.user.save();

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { upvotes: body.upvotes, downvotes: body.downvotes },
    { new: true }
  ).populate("user");

  res.json(updatedComment);
};

const downvoteComment = async (req, res) => {
  const body = req.body;
  const commentId = req.params.commentId;

  if (body.hasDownvotedAlready) {
    req.user.commentsDownvoted = req.user.commentsDownvoted.filter(
      (id) => id.toString() !== commentId
    );
  } else if (body.hasUpvotedAlready) {
    req.user.commentsDownvoted = req.user.commentsDownvoted.concat(commentId);
    req.user.commentsUpvoted = req.user.commentsUpvoted.filter(
      (id) => id.toString() !== commentId
    );
  } else {
    req.user.commentsDownvoted = req.user.commentsDownvoted.concat(commentId);
  }
  await req.user.save();

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { upvotes: body.upvotes, downvotes: body.downvotes },
    { new: true }
  ).populate("user");

  res.json(updatedComment);
};

module.exports = {
  getAllComments,
  createComment,
  upvoteComment,
  downvoteComment,
};
