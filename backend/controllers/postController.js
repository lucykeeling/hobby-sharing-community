const Post = require('../models/post');
const User = require('../models/User');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Create a post
const createPost = async (req, res) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category || !description || !req.files || !req.files.image) {
            return res.status(422).json({ message: 'Please fill all the fields' });
        }

        const { image } = req.files;

        if (image.size > 2000000) {
            return res.status(422).json({ message: 'File size should be less than 2MB' });
        }



        const newPost = await Post.create({
            title,
            category,
            description,
            image: {
                data: image.data,
                contentType: image.mimetype
            },
            creator: req.user.id,
        });

        await User.findByIdAndUpdate(req.user.id, { $inc: { postCount: 1 } });

        const { image: _img, ...postWithoutImage } = newPost.toObject();
        res.status(201).json(postWithoutImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({ postStatus: 'approved' }).select('-image').sort({ createdAt: -1 }).populate('creator', 'name').populate('category', 'Category_name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all pending posts
const getAllPendingPosts = async (req, res) => {
    try {
        const posts = await Post.find({ postStatus: 'pending' }).select('-image').sort({ createdAt: -1 }).populate('creator', 'name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's posts
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ creator: req.user.id }).select('-image').sort({ createdAt: -1 }).populate('creator', 'name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all approved posts for a specific user
const getPostsByAuthor = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.userId)) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const posts = await Post.find({ creator: req.params.userId, postStatus: 'approved' }).select('-image').sort({ createdAt: -1 }).populate('creator', 'name').populate('category', 'Category_name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred while fetching posts' });
    }
};

//Get a single post by ID
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).select('-image').populate('creator', 'name').populate('category', 'Category_name');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get post image by ID
const getPostImage = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).select('image');
        if (!post?.image?.data) return res.status(404).end();
        res.set('Content-Type', post.image.contentType);
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(post.image.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get post by Category
const getCatPosts = async (req, res) => {
    try {
        const { category } = req.params;
        const catPosts = await Post.find({ category, postStatus: 'approved' }).select('-image').sort({ createdAt: -1 }).populate('creator', 'name').populate('category', 'Category_name');
        res.status(200).json(catPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Search posts by title, description, or category
const searchPosts = async (req, res) => {
    try {
        const { q } = req.query;
        const filter = { postStatus: 'approved' };

        if (q && q.trim()) {
            const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'i');
            const matchingCats = await Category.find({ Category_name: regex }).select('_id');
            const catIds = matchingCats.map((c) => c._id);

            filter.$or = [
                { title: regex },
                { description: regex },
                { category: { $in: catIds } },
            ];
        }
        const posts = await Post.find(filter).sort({ createdAt: -1 }).select('-image').populate('creator', 'name').populate('category', 'Category_name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Edit post
const editPost = async (req, res) => {
    try {
        const { title, category, description } = req.body;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the owner of this post' });
        }

        post.title = title;
        post.category = category;
        post.description = description;

        if (req.files && req.files.image) {
            const { image } = req.files;

            if (image.size > 2000000) {
                return res.status(422).json({ message: 'File size should be less than 2MB' });
            }




            post.image = {
                data: image.data,
                contentType: image.mimetype
            };
        }

        post.postStatus = 'pending';
        post.rejectionReason = '';
        post.updatedAt = Date.now();

        const updatedPost = await post.save();

        const { image: _img, ...postWithoutImage } = updatedPost.toObject();
        res.status(200).json(postWithoutImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Delete post
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the owner of this post' });
        }


        await Post.findByIdAndDelete(postId);

        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.postCount > 0 ? currentUser.postCount - 1 : 0;
        await User.findByIdAndUpdate(req.user.id, { postCount: userPostCount });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN FUNCTIONS

// Moderate Posts
const moderatePost = async (req, res) => {

    try {
        const postId = req.params.id;
        const { postStatus, rejectionReason } = req.body;

        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to moderate posts' });
        }

        if (!['approved', 'rejected'].includes(postStatus)) {
            return res.status(400).json({ message: 'Invalid post status' });
        }

        if (postStatus === 'rejected' && !rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required when rejecting a post' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.postStatus = postStatus
        post.rejectionReason = postStatus === 'rejected' ? rejectionReason : '';

        const updatedPost = await post.save();
        const { image: _img, ...postWithoutImage } = updatedPost.toObject();
        res.status(200).json(postWithoutImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = { createPost, getAllPosts, getAllPendingPosts, getUserPosts, getPostsByAuthor, getPost, getCatPosts, searchPosts, editPost, deletePost, moderatePost, getPostImage };
