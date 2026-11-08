const express = require('express');
const { createPost, getAllPosts, getUserPosts, getPost, getCatPosts, editPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);
router.get('/all', getAllPosts);
router.get('/user', protect, getUserPosts);
router.get('/category/:category', getCatPosts);
router.get('/search', searchPosts);
router.get('/:id', getPost);
router.put('/:id', protect, editPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
