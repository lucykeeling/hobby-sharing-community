const User = require('../models/User');
const mongoose = require('mongoose');
const { buildProfile } = require('../profile/ProfileBuilder');
const Post = require('../models/post')


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const postsCount = await Post.countDocuments({ creator: user._id });
        res.status(200).json(buildProfile(user, { isOwner: true, postsCount }));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPublicProfile = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const user = await User.findById(req.params.id).select('-password -email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const postsCount = await Post.countDocuments({ creator: user._id, postStatus: 'approved' });
        res.status(200).json(buildProfile(user, { isOwner: false, postsCount }));
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred while fetching the user profile' });
    }
};

const getUserImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('profileImage');
        if (!user?.profileImage?.data) {
            return res.status(404).end();
        }
        res.set('Content-Type', user.profileImage.contentType);
        res.set('Cache-Control', 'no-cache');
        res.send(user.profileImage.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('posts');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ posts: user.posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, role } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;

        if (req.body.visibility) user.visibility = JSON.parse(req.body.visibility);
        if (req.body.bio !== undefined) user.bio = req.body.bio;

        if (req.body.role && req.body.role !== user.role) {
            if (req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Only admins can change roles' });
            }
            user.role = req.body.role;
        }
        if (req.files && req.files.profileImage) {
            const { profileImage } = req.files;

            if (profileImage.size > 2000000) {
                return res.status(422).json({ message: 'File size should be less than 2MB' });
            }
            if (!['image/png', 'image/jpeg'].includes(profileImage.mimetype)) {
                return res.status(422).json({ message: 'Only PNG or JPEG images allowed' });
            }

            user.profileImage = {
                data: profileImage.data,
                contentType: profileImage.mimetype
            };
        }
        user.postCount = req.body.postCount || user.postCount; // Only allow post count change if provided

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, hasProfileImage: !!updatedUser.profileImage?.data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateUserProfile, getProfile, getPublicProfile, getUserImage, getUserPosts };