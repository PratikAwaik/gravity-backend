const express = require("express");
const subredditController = require("../controllers/subreddit");
const middleware = require("../utils/middleware");

const router = express.Router();

// get all subreddits
router.get("/all", subredditController.getAllSubreddits);

// search for subreddits
router.get("/search", subredditController.getSearchSubreddits);

// get single subreddit
router.get("/:id", subredditController.getSingleSubreddit);

// get single subreddit posts
router.get("/:id/posts", subredditController.getSingleSubredditPosts);

// get single subreddit memebers and moderators
router.get(
  "/:id/users",
  subredditController.getSingleSubredditMembersAndModerators
);

// create new subreddit
router.post(
  "/create",
  middleware.userExtractor,
  subredditController.createSubreddit
);

// subcribe/unsubscribe user
router.patch(
  "/:id/subscribe",
  middleware.userExtractor,
  subredditController.handleUserSubscription
);

// update subreddit
router.patch(
  "/:id/update",
  middleware.userExtractor,
  subredditController.updateSubreddit
);

module.exports = router;
