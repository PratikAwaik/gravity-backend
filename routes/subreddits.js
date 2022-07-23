const express = require("express");
const subredditsController = require("../controllers/subreddits");
const middleware = require("../utils/middleware");

const router = express.Router();

/* get all subreddits */
router.get("/", subredditsController.getAllSubreddits);

/* create new subreddit */
router.post(
  "/create",
  middleware.userExtractor,
  subredditsController.createNewSubreddit
);

module.exports = router;
