const express = require("express");
const middleware = require("../utils/middleware");
const commentsController = require("../controllers/comments");

const router = express.Router({ mergeParams: true });

// get all comments for the post
router.get("/", commentsController.getAllComments);

// post a comment
router.post("/", middleware.userExtractor, commentsController.createComment);

module.exports = router;
