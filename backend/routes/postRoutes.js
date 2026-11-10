const express = require('express');
const { createPost, getAllPosts, getUserPosts, getPost, getCatPosts, searchPosts, editPost, deletePost, moderatePost, getAllPendingPosts } = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);
router.get('/all', protect, getAllPosts);
router.get('/user', protect, getUserPosts);
router.get('/category/:category', protect, getCatPosts);
router.get('/search', protect, searchPosts);
router.get('/pending', protect, adminOnly, getAllPendingPosts);
router.get('/:id', protect, getPost);
router.put('/:id', protect, editPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/moderate', protect, moderatePost);

module.exports = router;
