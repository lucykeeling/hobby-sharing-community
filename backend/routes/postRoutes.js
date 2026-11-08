const express = require('express');
const { createPost, getAllPosts, getUserPosts, getPost, getCatPosts, searchPosts, editPost, deletePost, moderatePost, getAllPendingPosts } = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);
router.get('/all', getAllPosts);
router.get('/user', protect, getUserPosts);
router.get('/category/:category', getCatPosts);
router.get('/search', searchPosts);
router.get('/pending', protect, adminOnly, getAllPendingPosts);
router.get('/:id', getPost);
router.put('/:id', protect, editPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/moderate', protect, moderatePost);

module.exports = router;
