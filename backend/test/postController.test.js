//Copied from module 3.6 activity 1
//waiting to hear from Nasrin if we need to include tests for assignment 1 code

const chai = require('chai'); const chaiHttp =
require('chai-http'); const http =
require('http'); const app = require('../server');
const connectDB = require('../config/db'); const
mongoose = require('mongoose'); const sinon =
require('sinon'); const Task =
require('../models/Category'); const {
updateCategory,getCategories,addCategory,deleteCategory } =
require('../controllers/categoryController'); const {
expect } = chai; 

describe('Category Controller - createCategory', () => {
  
  it('should create a category successfully', () => {
    // Test logic for successful category creation
  });

  it('should throw an error if required fields are missing', () => {
    // Test logic for missing fields
  });

  it('should validate category input before saving', () => {
    // Test logic for input validation
  });

});