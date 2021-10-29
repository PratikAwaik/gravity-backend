const mongoose = require("mongoose");
const Comment = require("../models/comment");
const Post = require("../models/post");

const getAllComments = async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId }).populate("user");
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
    level: body.level,
    createdAt: Date.now(),
  });
  await newComment.save();
  const populatedComment = await newComment.populate("user");

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

  await Comment.findByIdAndUpdate(
    commentId,
    { upvotes: body.upvotes, downvotes: body.downvotes },
    { new: true }
  );

  res.status(200).end();
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

  await Comment.findByIdAndUpdate(
    commentId,
    { upvotes: body.upvotes, downvotes: body.downvotes },
    { new: true }
  );

  res.status(200).end();
};

const editComment = async (req, res) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    { ...req.body, editedAt: Date.now() },
    { new: true }
  ).populate("user");
  res.json(updatedComment);
};

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (comment.user.toString() === req.user.id.toString()) {
    const deletedComment = await Comment.findByIdAndUpdate(
      comment.id,
      { content: "[deleted]", user: null },
      { new: true }
    );
    res.json(deletedComment);
  } else {
    res
      .status(401)
      .send({ error: "You are not authorized to delete the post" });
  }
};

module.exports = {
  getAllComments,
  createComment,
  upvoteComment,
  downvoteComment,
  editComment,
  deleteComment,
};
