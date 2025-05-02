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
    res.status(401).json({ message: 'Unauthorized: Please log in.' });
    res.redirect('/login');
  },

  // Ensure user is NOT authenticated (e.g., for login/register pages)
  isGuest: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    console.log('Auth Middleware: Authenticated user trying to access guest route, redirecting to /admin/dashboard');
    res.redirect('/admin/dashboard'); // Or perhaps '/' depending on desired flow
  }
}; 