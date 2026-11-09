const express = require('express');
const { getCategories, createCategory, editCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getCategories);                           
router.post('/', protect, adminOnly, createCategory);    
router.put('/:id', protect, adminOnly, editCategory);  
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
