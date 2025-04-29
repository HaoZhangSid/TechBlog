// controllers/indexController.js
const Post = require('../models/Post');

// Display home page with published posts
exports.getHomePage = async (req, res) => {
  try {
    const publishedPosts = await Post.find({ published: true })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    res.render('home', {
      title: 'Homepage',
      description: 'A blog about web development and technology',
      posts: publishedPosts,
      isHomePage: true
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    req.flash('error_msg', 'Error fetching posts: ' + error.message);
    res.redirect('/');
  }
};

// Display post detail page with error handling
exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate('author', 'username')
      .lean();

    if (!post) {
      return res.status(404).render('404', {
        title: 'Post Not Found',
        description: 'The requested post could not be found'
      });
    }

    // Ensure only published posts are accessible to non-admins
    if (!post.published && (!req.user || !req.user.isAdmin)) {
      req.flash('error_msg', 'Post is not published');
      return res.redirect('/');
    }

    res.render('post-details', {
      title: post.title,
      layout: 'main',
      description: post.summary,
      post,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    req.flash('error_msg', 'Error fetching post: ' + error.message);
    res.redirect('/');
  }
};

// Display about page
exports.getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About',
    description: 'Learn more about the Tech Blog platform',
    isAboutPage: true
  });
};