// middleware/auth.js

module.exports = {
  // Ensure user is authenticated
  isAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // User is logged in, proceed to the next middleware/route handler
    }
    // User is not logged in
    console.log('Auth Middleware: User not authenticated, redirecting to /login');
    req.flash('error_msg', 'Please log in to view this resource.');
    res.redirect('/login');
    return; // Added return here to stop execution after redirect
  },
}; 