const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const { randomUUID } = require('crypto');
const fs = require('fs');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, name: user.name, email: user.email, role: user.role, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json({
            name: user.name,
            email: user.email,
            role: user.role,
            postCount: user.postCount,
            profileImage: user.profileImage,
        });
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

        const updateUserProfile = async (req, res) => {
            try {
                const user = await User.findById(req.user.id);
                if (!user) return res.status(404).json({ message: 'User not found' });

                const { name, email, role } = req.body;
                user.name = name || user.name;
                user.email = email || user.email;
            

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

        const parts = profileImage.name.split('.');
        const extension = parts[parts.length - 1];
        const newFileName = parts[0] + randomUUID() + '.' + extension;


        await profileImage.mv(path.join(__dirname, '../uploads/', newFileName));

        if (user.profileImage) {
            fs.unlink(path.join(__dirname, '../uploads/', user.profileImage), () => {});
        }
        user.profileImage = newFileName;
    }
    

        user.postCount = req.body.postCount || user.postCount; // Only allow post count change if provided

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, profileImage: updatedUser.profileImage, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
