// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Import controller
const authController = require('../controllers/authController');

// GET /login - Display login page
router.get('/login', authController.getLoginPage);

// POST /login - Handle login attempt (web-based)
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

// POST /api/login - Handle login attempt (API-based)
router.post('/api/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').notEmpty()
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' || info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        return res.status(200).json({ message: 'Authenticated successfully', user });
      });
    })(req, res, next);
  }
);

module.exports = router; 