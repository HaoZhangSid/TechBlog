const express = require('express');
const router = express.Router();

// @desc    Homepage
// @route   GET /
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Homepage' 
    // No need to explicitly pass isAdminPage=false here, 
    // it will be falsy by default in the template if not provided
  }); 
});

// @desc    About page
// @route   GET /about
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Us' 
    // isAdminPage will be falsy here too
  }); 
});

module.exports = router; 