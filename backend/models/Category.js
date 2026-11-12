const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    Category_name: { type: String, required: true, unique: true, trim: true },
});

module.exports = mongoose.model('Category', categorySchema);