const Post = require('../models/post');
const Category = require('../models/Category');
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


        if (!name) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        const existing = await Category.findOne({
            Category_name: new RegExp('^' + escapeRegExp(name) + '$', 'i'),
        });
        if (existing) {
            return res.status(409).json({ message: 'Category already exists' });
        }

        const newCategory = await Category.create({ Category_name: name });
        res.status(201).json(newCategory);
    } catch (error) {

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

        if (!name) {
            return res.status(422).json({ message: 'Category name is required' });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const existing = await Category.findOne({
            Category_name: new RegExp('^' + escapeRegExp(name) + '$', 'i'),
            _id: { $ne: categoryId },
        });
        if (existing) {
            return res.status(409).json({ message: 'Category already exists' });
        }

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

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const count = await Post.countDocuments({ category: categoryId });
        if (count > 0) {
            return res.status(409).json({
                message: `Cannot delete: ${count} post(s) still use this category`,
            });
        }
        
        await category.deleteOne();
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCategories, createCategory, editCategory, deleteCategory };
