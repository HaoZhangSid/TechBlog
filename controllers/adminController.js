// controllers/adminController.js
const Post = require("../models/Post");
const { default: slugify } = require("slugify");
const { body, validationResult } = require("express-validator");

// Validation middleware for post creation and editing
const postValidation = [
  body("title").notEmpty().withMessage("Title is required").trim()
  .customSanitizer((value) => value.replace(/#{1,6}\s*/g, ''))
  .isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters long"),
  body("summary").notEmpty().withMessage("Summary is required").trim()
  .isLength({ min: 10, max: 300 }).withMessage("Summary must be between 10 and 300 characters long"),
  body("content").notEmpty().withMessage("Content is required").trim()
  .isLength({ min: 20 }).withMessage("Content must be at least 20 characters long"),
  body("published").optional()
  .customSanitizer(value => value === 'on' || value === true) // Convert to boolean for both form and API submissions
  .isBoolean().withMessage("Published must be a boolean")
];

// Display Admin Dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Fetch the actual post count from the database
    const postCount = await Post.countDocuments();
    
    // Keep comment count hardcoded for now, or fetch if needed
    const commentCount = 1; 

    res.render('admin-dashboard', { 
      title: 'Admin Dashboard',
      layout: 'admin',
      postCount: postCount,
      commentCount: commentCount,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
      // user is already available globally via res.locals
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    req.flash('error_msg', 'Could not fetch dashboard statistics.');
    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin',
      postCount: 0,
      commentCount: 1,
      success_msg: req.flash('success_msg'), 
      error_msg: req.flash('error_msg')
    });
  }
};

// Display all posts
exports.getPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find().populate('author', 'username').lean();

    res.render('posts', { 
      title: 'All Posts',
      layout: 'admin',
      posts: posts,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error(error);
    res.flash('error_msg', 'Error fetching posts' + error.message);
    res.redirect('/admin/dashboard');
  }
};

// Display the form to create a new post
exports.getCreatePost = (req, res) => {
  res.render('post-form', { 
    title: 'Write New Post',
    layout: 'admin',
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
};

// Handle the creation of a new post
exports.postCreatePost = [...postValidation, async (req, res) => {
  // Validate the request body and return errors if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', '); // Extract & join error messages
    console.error('Validation errors: ', errorMessages);
    req.flash('error_msg', errorMessages); // Flash error messages to the user
    return res.redirect('/admin/posts/create');
  }

  try {
    // Create a new post
    const { title, summary, content, published } = req.body;
    const slug = slugify(title, { lower: true, strict: true });
    const newPost = new Post({
      title,
      slug,
      summary,
      content,
      published: published === 'on' || published == true,
      author: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newPost.save();
    req.flash('success_msg', 'Post created successfully');
    res.redirect('/admin/posts');
  }
  catch (error) {
    console.error('Post creation error: ', error);
    req.flash('error_msg', 'Error creating post' + error.message);
    res.redirect('/admin/posts/create');
  }
}];

// Display the form to edit a post
exports.getEditPost = async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post to edit
    const post = await Post.findById(postId).populate('author', 'username').lean();
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/admin/posts');
    }

    res.render('post-form', { 
      title: 'Edit Post',
      layout: 'admin',
      post: post,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  }
  catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching post' + error.message);
    res.redirect('/admin/posts');
  }
}

// Handle the update of a post
exports.postEditPost = [...postValidation, async (req, res) => {
  const postId = req.params.id;

  // Validate the request body and return errors if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    console.error('Validation errors: ', errorMessages);
    req.flash('error_msg', errorMessages);
    return res.redirect(`/admin/posts/edit/${postId}`);
  }

  try {
    // Fetch the post to edit
    const { title, summary, content, published } = req.body;
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const post = await Post.findById(postId);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/admin/posts');
    }

    // Update the post
    await Post.findByIdAndUpdate(postId, {
      ...Post[postId],
      title,
      slug,
      summary,
      content,
      published: published === 'on' || published == true,
      updatedAt: new Date()
    });
    await post.save();
    req.flash('success_msg', 'Post updated successfully');
    res.redirect('/admin/posts');
  }
  catch (error) {
    console.error('Post update error: ', error);
    req.flash('error_msg', 'Error updating post' + error.message);
    res.redirect(`/admin/posts/edit/${postId}`);
  }
}];

// Handle the deletion of a post
exports.postDeletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    // Delete the post
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/admin/posts');
    } else {
      req.flash('success_msg', 'Post deleted successfully');
    }
    res.redirect('/admin/posts')
  }
  catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error deleting post' + error.message);
    res.redirect('/admin/posts');
  }
}