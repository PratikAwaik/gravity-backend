const express = require("express");
const subredditController = require("../controllers/subreddit");
const middleware = require("../utils/middleware");

const router = express.Router();

// get all subreddits
router.get("/all", subredditController.getAllSubreddits);

// create new subreddit
router.post(
  "/create",
  middleware.userExtractor,
  subredditController.createSubreddit
);

module.exports = router;
