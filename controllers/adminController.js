// controllers/adminController.js

const { create } = require("connect-mongo");
const { updateMany } = require("../models/User");
const Post = require("../models/Post");
const { default: slugify } = require("slugify");

// Display Admin Dashboard
exports.getDashboard = (req, res) => {
  // Data for the dashboard (replace with actual data fetching later)
  const postCount = 0; // Placeholder
  const commentCount = 0; // Placeholder

  res.render('admin-dashboard', { 
    title: 'Admin Dashboard',
    layout: 'admin', // Specify the admin layout
    postCount: postCount,
    commentCount: commentCount,
    // user is already available globally via res.locals
  });
};

// Display all posts
exports.getPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find().populate('author', 'username');

    res.render('posts', { 
      title: 'All Posts',
      layout: 'admin',
      posts: posts,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
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
exports.postCreatePost = async (req, res) => {
  const { title, summary, content, published } = req.body;

  // Validate input (to be improved with a express-validator)
  if (!title || !content || !slug || !summary) {
    req.flash('error_msg', 'All fields are required');
    return res.redirect('/admin/posts/create');
  }

  try {
    // Create a new post
    const slug = slugify(title, { lower: true, strict: true });
    const newPost = new Post({
      title,
      slug,
      summary,
      content,
      published: published === 'on', // Convert to boolean
      author: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newPost.save();
    req.flash('success_msg', 'Post created successfully');
    res.redirect('/admin/posts');
  }
  catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error creating post' + error.message);
    res.redirect('/admin/posts/create');
  }
}

// Display the form to edit a post
exports.getEditPost = async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post to edit
    const post = await Post.findById(postId).populate('author', 'username');
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
exports.postEditPost = async (req, res) => {
  const postId = req.params.id;
  const { title, slug, summary, content, published } = req.body;
  const post = await Post.findById(postId);
  if (!post) {
    req.flash('error_msg', 'Post not found');
    return res.redirect('/admin/posts');
  }

  // Validate input (to be improved with a express-validator)
  if (!title || !content || !slug || !summary) {
    req.flash('error_msg', 'All fields are required');
    return res.redirect(`/admin/posts/edit/${postId}`);
  }

  try {
    // Update the post
    await Post.findByIdAndUpdate(postId, {
      ...Post[postId],
      title,
      slug,
      summary,
      content,
      published: published === 'on',
      updatedAt: new Date()
    });
    await post.save();
    req.flash('success_msg', 'Post updated successfully');
    res.redirect('/admin/posts');
  }
  catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating post' + error.message);
    res.redirect(`/admin/posts/edit/${postId}`);
  }
}

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