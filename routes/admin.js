const express = require('express');
const router = express.Router();

// Import authentication middleware
const { isAuthenticated } = require('../middleware/auth'); 

// Import admin controller (we need to ensure this exists and has the function)
const adminController = require('../controllers/adminController');

// @desc    Admin Dashboard
// @route   GET /admin/dashboard
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// Add other admin routes here later (e.g., for posts, comments)

module.exports = router; 