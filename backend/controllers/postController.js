const Post = require('../models/Post');
const User = require('../models/User');
const path = require('path');
const { randomUUID } = require('crypto');
const fs = require('fs');

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
        const posts = await Post.find( { postStatus: 'approved' }).sort({ createdAt: -1 }).populate('creator', 'username');
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

//Get a single post by ID
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('creator', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

// Edit post
const editPost = async (req, res) => {
    try {
        const { title, category, description } = req.body;
        const postId = req.params.id;

        // Find the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the owner of the post
        if (post.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not the owner of this post' });
        }

        // Update the text fields
        post.title = title;
        post.category = category;
        post.description = description;

        // Only runs if a new image was uploaded
        if (req.files && req.files.image) {
            const { image } = req.files;

            // check the file size
            if (image.size > 2000000) {
                return res.status(422).json({ message: 'File size should be less than 2MB' });
            }

            // delete the old image from the uploads folder
            fs.unlink(path.join(__dirname, '../uploads/', post.image), (err) => {
                if (err) console.error('Could not delete old image', err);
            });

            // give the new file a unique name and save it
            const parts = image.name.split('.');
            const extension = parts[parts.length - 1];
            const newFileName = parts[0] + randomUUID() + '.' + extension;
            await image.mv(path.join(__dirname, '../uploads/', newFileName));

            // point the post at the new image
            post.image = newFileName;
        }

        // Save the updated post
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
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

const fileName = post.image

        //delete image from uploads folder
        fs.unlink(path.join(__dirname, '../uploads/', fileName), async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Could not delete image file' });
            } else {
                await Post.findByIdAndDelete(postId);
                //find user and reduce postCount by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.postCount > 0 ? currentUser.postCount - 1 : 0;
                await User.findByIdAndUpdate(req.user.id, { postCount: userPostCount });
                res.status(200).json({ message: 'Post deleted successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = { createPost, getAllPosts, getUserPosts, getPost, editPost, deletePost };
