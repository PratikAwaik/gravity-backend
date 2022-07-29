const express = require("express");
const postsController = require("../controllers/posts");
const { userExtractor } = require("../utils/middleware");

const router = express.Router();

/* get all posts */
router.get("/", postsController.getAllPosts);

/* get post by id */
router.get("/:id", postsController.getPostById);

/* create a post */
router.post("/create", userExtractor, postsController.createPost);

module.exports = router;
