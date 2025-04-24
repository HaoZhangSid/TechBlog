// middleware/auth.js
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login'); // We'll create the /login route later
  },

  // Add other middleware like forwardAuthenticated if needed later
}; 