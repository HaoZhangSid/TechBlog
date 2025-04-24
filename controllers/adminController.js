// controllers/adminController.js

// Display Admin Dashboard
exports.getDashboard = (req, res) => {
  // Data for the dashboard (replace with actual data fetching later)
  const postCount = 0; // Placeholder
  const commentCount = 0; // Placeholder

  res.render('admin-dashboard', { 
    title: 'Admin Dashboard',
    layout: 'admin', // Specify the admin layout
    postCount: postCount,
    commentCount: commentCount
    // user is already available globally via res.locals
  });
}; 