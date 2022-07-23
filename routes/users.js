const express = require("express");
const usersController = require("../controllers/users");

const router = express.Router();

/* get all users */
router.get("/", usersController.getAllUsers);

/* register user */
router.post("/register", usersController.registerUser);

/* login user */
router.post("/login", usersController.loginUser);

/* get single user */
router.get("/:id", usersController.getUserById);

module.exports = router;
