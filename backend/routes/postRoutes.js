const express = require('express');
const { createPost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createPost);

module.exports = router;
