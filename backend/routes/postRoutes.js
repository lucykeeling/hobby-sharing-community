const express = require('express');
const { getPosts, addPost, updatePost, deletePost } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getPosts).post(protect, addPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);

module.exports = router;