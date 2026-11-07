const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');
const { randomUUID } = require('crypto');

// Create a post
const createPost = async (req, res) => {
    try {
        const { title, category, description } = req.body;

        if (!title || !category || !description || !req.files || !req.files.image) {
            return res.status(422).json({ message: 'Please fill all the fields' });
        }

        const { image } = req.files;

        // check the file size
        if (image.size > 2000000) {
            return res.status(422).json({ message: 'File size should be less than 2MB' });
        }

        // give the file a unique name
        const parts = image.name.split('.');
        const extension = parts[parts.length - 1];
        const newFileName = parts[0] + randomUUID() + '.' + extension;

        // save the file into the uploads folder
        await image.mv(path.join(__dirname, '../uploads/', newFileName));

        // save the post to the database
        const newPost = await Post.create({
            title,
            category,
            description,
            image: newFileName,
            creator: req.user.id,
        });

        // increase the user's post count by 1
        await User.findByIdAndUpdate(req.user.id, { $inc: { postCount: 1 } });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('creator', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

// Get user's posts
const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ creator: req.user.id }).sort({ createdAt: -1 }).populate('creator', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  


  
        module.exports = { createPost, getAllPosts, getUserPosts };
