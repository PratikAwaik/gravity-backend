const express = require("express");
const middleware = require("../utils/middleware");
const commentsController = require("../controllers/comments");

const router = express.Router({ mergeParams: true });

// get all comments for the post
router.get("/", commentsController.getAllComments);

// post a comment
router.post("/", middleware.userExtractor, commentsController.createComment);

// upvote comment
router.patch(
  "/:commentId/upvote",
  middleware.userExtractor,
  commentsController.upvoteComment
);

// downvote comment
router.patch(
  "/:commentId/downvote",
  middleware.userExtractor,
  commentsController.downvoteComment
);

// delete comment (sending PATCH request because actually deleting a comment will cause it's child comments to be deleted as well)
router.patch(
  "/:commentId/delete",
  middleware.userExtractor,
  commentsController.deleteComment
);

// edit comment
router.patch(
  "/:commentId/edit",
  middleware.userExtractor,
  commentsController.editComment
);

module.exports = router;
