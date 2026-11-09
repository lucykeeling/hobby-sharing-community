const Post = require('../models/post');
const Category = require('../models/Category');

// Escape special regex characters so user text is matched literally
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Get categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ Category_name: 1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create category
const createCategory = async (req, res) => {
    try {
        const name = req.body.Category_name?.trim();

        // 1. validate
        if (!name) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        // 2. check for a case-insensitive duplicate BEFORE creating
        const existing = await Category.findOne({
            Category_name: new RegExp('^' + escapeRegExp(name) + '$', 'i'),
        });
        if (existing) {
            return res.status(409).json({ message: 'Category already exists' });
        }

        // 3. create
        const newCategory = await Category.create({ Category_name: name });
        res.status(201).json(newCategory);
    } catch (error) {
        // safety net for two requests arriving at the same moment
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Edit category
const editCategory = async (req, res) => {
    try {
        const name = req.body.Category_name?.trim();
        const categoryId = req.params.id;

        // 1. validate
        if (!name) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        // 2. make sure the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // 3. duplicate check, excluding this category itself
        const existing = await Category.findOne({
            Category_name: new RegExp('^' + escapeRegExp(name) + '$', 'i'),
            _id: { $ne: categoryId },
        });
        if (existing) {
            return res.status(409).json({ message: 'Category already exists' });
        }

        // 4. update and save
        category.Category_name = name;
        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // 1. does it exist?
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // 2. is any post still using it?
        const count = await Post.countDocuments({ category: categoryId });
        if (count > 0) {
            return res.status(409).json({
                message: `Cannot delete: ${count} post(s) still use this category`,
            });
        }

        // 3. safe to delete
        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCategories, createCategory, editCategory, deleteCategory };
