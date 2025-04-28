const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Route for the home page
router.get('/', indexController.getHomePage);

// Route for the post detail page
router.get('/posts/:slug', indexController.getPostBySlug);

// Route for the about page
router.get('/about', indexController.getAboutPage);

module.exports = router;