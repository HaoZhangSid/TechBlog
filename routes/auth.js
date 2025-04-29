// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check } = require('express-validator'); // Import check if needed for validation

// Import controller (we will create this next)
const authController = require('../controllers/authController');

// GET /login - Display login page
router.get('/login', authController.getLoginPage);

// POST /login - Handle login attempt
// Add validation middleware if desired
router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/dashboard', // Redirect on success (will create later)
  failureRedirect: '/login',          // Redirect on failure
  failureFlash: true                   // Enable flash messages for errors
}));

// GET /forgot-password - Display forgot password page
router.get('/forgot-password', authController.getForgotPasswordPage);

// POST /logout - Handle logout
router.post('/logout', authController.postLogout);


module.exports = router; 