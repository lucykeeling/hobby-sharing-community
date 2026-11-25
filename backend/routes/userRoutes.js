const express = require('express');
const { updateUserProfile, getProfile, getUserImage, getUserPosts, getPublicProfile, getBadgeOptions } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/badges', getBadgeOptions);
router.get('/user-image/:id', getUserImage);
router.get('/user/:id', getUserPosts);
router.get('/profile/:id', protect,getPublicProfile);

module.exports = router;