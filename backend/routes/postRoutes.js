const express = require('express');
const { createPost, getAllPosts, getUserPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);
router.get('/all', getAllPosts);
router.get('/user', protect, getUserPosts);

module.exports = router;
