**Task 4: Functional Testing**
Unit-test each backend function, including relevant error cases. Include terminal screenshots showing pass or fail results and link the tests to the requirements they verify.

**Sample code structure from Module 3.6 Activity 1**

const chai = require('chai'); const chaiHttp =
require('chai-http'); const http =
require('http'); const app = require('../server');
const connectDB = require('../config/db'); const
mongoose = require('mongoose'); const sinon =
require('sinon'); const Task =
require('../models/Task'); const {
updateTask,getTasks,addTask,deleteTask } =
require('../controllers/taskController'); const {
expect } = chai; 

describe('Task Controller - createTask', () => {
  
  it('should create a task successfully', () => {
    // Test logic for successful task creation
  });

  it('should throw an error if required fields are missing', () => {
    // Test logic for missing fields
  });

  it('should validate task input before saving', () => {
    // Test logic for input validation
  });

});


**Team testing plan**
 - one describe block per function
 - include requirement ID in the test name for traceabiliy
 - each function gets a success test, an error (500) test, and whichever other 400/403/404 tests apply
 - restore stubbed methods or functions after a test


 **Run from backend using npm run test**
 