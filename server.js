require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const flash = require('connect-flash');

// Import custom configurations
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const configureHandlebars = require('./config/handlebars');

// Connect to database
connectDB();

// Configure Passport Strategy
configurePassport(passport);

const app = express();

// Configure Handlebars as the view engine
configureHandlebars(app);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_strong_secret_fallback', // Ensure you have SESSION_SECRET in .env
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // Set secure flag in production
  }
}));

// Passport Middleware (Initialize Passport and enable session support)
app.use(passport.initialize());
app.use(passport.session());

// Flash Message Middleware (requires session)
app.use(flash());

// Global variables for flash messages and user authentication
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Passport specific errors often use 'error'
  res.locals.user = req.user || null; // Make user available
  next();
});

// Import Route Files and mount routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);

// Add route for testing the error handler
app.get('/test-error', (req, res, next) => {
  const testError = new Error("This is a deliberate test error!");
  testError.status = 503; // Example: Service Unavailable
  testError.id = 'TEST-ERR-001'; // Example error ID
  next(testError); // Pass the error to the error handling middleware
});

// Add route for 404 Handler
app.use((req, res, next) => {
  // Render the dedicated 404 view, using the default layout
  res.status(404).render('404', { // Change 'error' to '404'
    // The content is set in the 404.hbs file
  });
});

// Route for Error Handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack); // Log the full error stack trace

  const statusCode = err.status || 500; // Use error status or default to 500
  // In production, avoid sending detailed error messages to the client
  const errorMessage = process.env.NODE_ENV === 'production' ? 'An unexpected error occurred on the server.' : err.message;
  const errorId = err.id || 'UNKNOWN'; // Use error ID or Unknown if not provided

  // Ensure response headers are not already sent before attempting to render
  if (res.headersSent) {
    return next(err); // Delegate to default Express error handler
  }

  // Render the error view, using the default layout
  res.status(statusCode).render('error', {
    error: errorMessage,
    id: errorId
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 