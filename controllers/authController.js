// Display login page
exports.getLoginPage = (req, res) => {
    if (req.isAuthenticated()) {
      console.log('User already authenticated, redirecting to dashboard.');
      return res.redirect('/admin/dashboard');
    }
    res.render('login', {
      title: 'Login',
      description: 'Login to access the admin dashboard'
    });
  };
  
  // Handle login POST request
  exports.postLogin = (req, res, next) => {
    console.log(`Login attempt received for email: ${req.body.email}`); // Log attempt
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array()[0].msg;
      console.warn(`Login validation failed for ${req.body.email}: ${errorMsg}`); // Log validation error
      req.flash('error', errorMsg);
      return res.redirect('/login');
    }
  
    console.log(`Passing login request for ${req.body.email} to Passport authenticate`);
    passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  };
  
  // Handle logout POST request
  exports.postLogout = (req, res, next) => {
    const userEmail = req.user ? req.user.email : 'unknown user'; // Get email before logout
    console.log(`Logout request received for user: ${userEmail}`);
    req.logout(function(err) {
      if (err) {
        console.error(`Logout error for user ${userEmail}:`, err);
        return next(err);
      }
      console.log(`User ${userEmail} logged out successfully.`);
      req.flash('success_msg', 'You are logged out');
      res.redirect('/login');
    });
  };
  