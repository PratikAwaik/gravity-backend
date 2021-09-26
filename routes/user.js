const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

// get all users
router.get("/", userController.getAllUsers);

// get single user
router.get("/:id", userController.getSingleUser);

// register user
router.post("/register", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

module.exports = router;
