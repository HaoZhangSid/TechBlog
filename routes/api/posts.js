const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../../models/Post');
const { isAuthenticated } = require('../../middleware/auth');

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
  '/', isAuthenticated,
  [
    body('title').notEmpty().withMessage('Title is required').trim(),
    body('summary').notEmpty().withMessage('Summary is required').trim(),
    body('content').notEmpty().withMessage('Content is required').trim(),
    body('published').optional().isBoolean().withMessage('Published must be a boolean')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, summary, content, published } = req.body;
      const newPost = new Post({
        title,
        summary,
        content,
        published: published || false,
        author: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await newPost.save();
      res.status(201).json(newPost);
      res.location(`/api/posts/${newPost._id}`);
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
  '/:id', isAuthenticated,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
    body('summary').optional().notEmpty().withMessage('Summary cannot be empty').trim(),
    body('content').optional().notEmpty().withMessage('Content cannot be empty').trim(),
    body('published').optional().isBoolean().withMessage('Published must be a boolean')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const id = req.params.id;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Allow the author to update only their own posts
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only edit your own posts' });
      }

      const { title, summary, content, published } = req.body;
      post.title = title || post.title;
      post.summary = summary || post.summary;
      post.content = content || post.content;
      post.published = published !== undefined ? published : post.published;
      post.updatedAt = new Date();

      await post.save();
      res.json(post);
    } catch (err) {
      console.error('Error updating post:', err);
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

// DELETE a post by ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Allow the author to delete only their own posts
    if (post.author.toString() !== req.user._id.toString()) {
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