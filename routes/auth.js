// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Import controller (we will create this next)
const authController = require('../controllers/authController');

// GET /login - Display login page
router.get('/login', authController.getLoginPage);

// POST /login - Handle login attempt
router.post('/login', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Password is required').notEmpty()
], authController.postLogin);

// GET /forgot-password - Display forgot password page
router.get('/forgot-password', authController.getForgotPasswordPage);

// POST /forgot-password - Handle forgot password request
router.post('/forgot-password', [
  check('email', 'Please enter a valid email').isEmail()
], authController.postForgotPassword);

// GET /reset-password/:token - Display reset password page
router.get('/reset-password/:token', authController.getResetPasswordPage);

// POST /reset-password/:token - Handle reset password request
router.post('/reset-password/:token', [
  check('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
  check('password2').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], authController.postResetPassword);

// POST /logout - Handle logout
router.post('/logout', authController.postLogout);

module.exports = router; 