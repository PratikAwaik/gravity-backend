const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

// get all users
router.get("/", userController.getAllUsers);

// get single user
router.get("/:id", userController.getSingleUser);

// get user's subreddits
router.get("/:id/subreddits", userController.getSubreddits);

// get user's posts
router.get("/:id/posts", userController.getPosts);

// get user's comments
router.get("/:id/comments", userController.getComments);

// register user
router.post("/register", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

// update user
router.patch("/:id/update", userController.updateUser);

module.exports = router;
