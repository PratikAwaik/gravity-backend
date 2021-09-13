const express = require('express');
const postsController = require('../controllers/posts');
const middleware = require('../utils/middleware');
const router = express.Router();

// get all posts
router.get('/', postsController.getAllPosts);

// get single post
router.get('/:id', postsController.getSinglePost);

// create a post
router.post('/', middleware.userExtractor, postsController.createPost);

// delete a post
router.delete('/:id', middleware.userExtractor, postsController.deletePost);

module.exports = router;