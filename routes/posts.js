const express = require('express');
const postsController = require('../controllers/posts');
const router = express.Router();

// get all posts
router.get('/', postsController.getAllPosts);

// get single post
router.get('/:id', postsController.getSinglePost);

// create a post
router.post('/', postsController.createPost);

// delete a post
router.delete('/:id', postsController.deletePost);

module.exports = router;