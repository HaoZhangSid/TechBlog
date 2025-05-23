const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth'); 
const adminController = require('../controllers/adminController');

// Render the admin dashboard
router.get('/dashboard', isAuthenticated, adminController.getDashboard);

// List all posts
router.get('/posts', isAuthenticated, adminController.getPosts);

// Render the form to create a new post
router.get('/posts/create', isAuthenticated, adminController.getCreatePost);

// Handle the creation of a new post
router.post('/posts/create', isAuthenticated, adminController.postCreatePost);

// Render the form to edit a post
router.get('/posts/edit/:id', isAuthenticated, adminController.getEditPost);

// Handle the update of a post
router.post('/posts/edit/:id', isAuthenticated, adminController.postEditPost);

// Handle the deletion of a post
router.post('/posts/delete/:id', isAuthenticated, adminController.postDeletePost);

module.exports = router;