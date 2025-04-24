// controllers/authController.js

// Display login page
exports.getLoginPage = (req, res) => {
  // Prevent logged-in users from seeing the login page
  if (req.isAuthenticated()) {
    console.log('Auth: User already authenticated, redirecting to /admin/dashboard');
    return res.redirect('/admin/dashboard'); // Will create this route later
  }
  // We need the view engine configured first to actually render
  // For now, just send a message or render will fail
  // res.render('login', { title: 'Login' }); 
  res.send('Login page placeholder - View engine needed'); 
};

// Handle logout POST request
exports.postLogout = (req, res, next) => {
  const userId = req.user ? req.user.id : 'unknown user';
  req.logout(function(err) {
    if (err) {
      console.error(`Auth: Logout error for user ${userId}:`, err);
      return next(err);
    }
    console.log(`Auth: User ${userId} logged out successfully.`);
    req.flash('success_msg', 'You have been logged out.');
    res.redirect('/login');
  });
};

// Placeholder for postLogin - Logic is handled by passport.authenticate in the route
exports.postLogin = (req, res) => {
  // This function might not even be called if passport.authenticate handles redirection
  // but it's good practice to have the controller function defined.
  console.error("Auth: postLogin controller function reached unexpectedly.");
  res.redirect('/'); // Fallback redirect
}; 