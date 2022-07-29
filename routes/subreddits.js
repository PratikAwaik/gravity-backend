const express = require("express");
const subredditsController = require("../controllers/subreddits");
const { userExtractor } = require("../utils/middleware");

const router = express.Router();

/* get all subreddits */
router.get("/", subredditsController.getAllSubreddits);

/* get subreddit by id */
router.get("/:id", subredditsController.getSubredditById);

/* create new subreddit */
router.post("/create", userExtractor, subredditsController.createNewSubreddit);

module.exports = router;
