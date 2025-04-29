// Index Controller
const { samplePosts } = require('../data/sampleData');
const Post = require('../models/Post');

// Display home page with published posts
exports.getHomePage = (req, res) => {
  const publishedPosts = samplePosts.filter(post => post.published);
  res.render('index', {
    title: 'Homepage',
    description: 'A blog about web development and technology',
    posts: publishedPosts,
    isHomePage: true // Indicate this is the home page for layout
  });
};

// Display post detail page with error handling
exports.getPostBySlug = (req, res) => {
    try {
        const { slug } = req.params;
        const post = Post.find(post => post.slug === slug);

        if (!post) {
            return res.status(404).render('404', {
                title: 'Post Not Found',
                description: 'The requested post could not be found'
            });
        }

        res.render('post-detail', {
            title: post.title,
            layout: 'main',
            description: post.summary,
            post: post,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg'),
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.flash('error_msg', 'An error occurred while fetching the post.' + error.message);
        res.redirect('/');
    }
};

// Display about page
exports.getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About',
    description: 'Learn more about the Tech Blog platform',
    isAboutPage: true // Indicate this is the about page for layout
  });
}; 