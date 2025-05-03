const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const { isAuthenticated } = require('../../middleware/auth');
const slugify = require('slugify');

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
    .customSanitizer(value => value === 'on' || value === true) // Convert to boolean
    .isBoolean().withMessage("Published must be a boolean")
];

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').lean();
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a post by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id).populate('author', 'username').lean();
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new post
router.post(
  '/', isAuthenticated, postValidation,
  async (req, res) => {
    // Validate the request body and return errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new post
    try {
      const { title, summary, content, published } = req.body;
      const slug = slugify(title, { lower: true, strict: true });
      const newPost = new Post({
        title,
        slug,
        summary,
        slug,
        content,
        published: published || false,
        author: req.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await newPost.save();
      res.location(`/api/posts/${newPost._id}`);
      res.status(201).json(newPost);
    } catch (err) {
      console.error('Error creating post:', err);
      if (err.code === 11000) {
        res.status(400).json({ message: 'A post with this title already exists' });
      } else if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  }
);

// PUT to update a post by ID
router.put(
  '/:id', isAuthenticated, postValidation,
  async (req, res) => {
    const id = req.params.id;

    // Validate the request body and return errors if any
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Update a post
    try {
      const { title, summary, content, published } = req.body;
      const slug = slugify(title, { lower: true, strict: true });
      const post = await Post.findById(id);

      // Check if the post exists & if the user is the author
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.author.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own posts' });
      }

      post.title = title || post.title;
      post.slug = slug || post.slug;
      post.summary = summary || post.summary;
      post.content = content || post.content;
      post.published = published || post.published;
      post.updatedAt = new Date();

      await post.save();
      res.status(200).json(post);
    } catch (err) {
      console.error('Error updating post:', err);
      if (err.code === 11000) {
        res.status(400).json({ message: 'A post with this title or slug already exists' });
      } else if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  }
);

// DELETE a post by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Allow the author to delete only their own posts
    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own posts' });
    }

    await Post.deleteOne({ _id: id });
    res.status(200).json({
      postId: id,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;