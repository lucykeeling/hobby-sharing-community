const express = require('express');
const { createPost, getAllPosts, getUserPosts, getPost, editPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);
router.get('/all', getAllPosts);
router.get('/user', protect, getUserPosts);
router.get('/:id', getPost);
router.put('/:id', protect, editPost);
module.exports = router;
