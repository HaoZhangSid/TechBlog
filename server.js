require('dotenv').config();
const express = require('express');
const session = require('express-session'); // Import express-session
const MongoStore = require('connect-mongo'); // Import connect-mongo
const passport = require('passport'); // Import passport
const connectDB = require('./config/db'); // Import connectDB
const configurePassport = require('./config/passport'); // Import passport config
const flash = require('connect-flash'); // Import connect-flash
const configureHandlebars = require('./config/handlebars'); // Import Handlebars config

// Connect to database
connectDB();

// Configure Passport Strategy
configurePassport(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars as the view engine
configureHandlebars(app);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware for parsing request bodies (place before session)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration with MongoStore (place before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_strong_secret_fallback', // Ensure you have SESSION_SECRET in .env
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // Ensure you have MONGODB_URI in .env
    collectionName: 'sessions' // Optional: Collection name for sessions
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' // Set secure flag in production
  }
}));

// Passport Middleware (Initialize Passport and enable session support)
// IMPORTANT: Must be placed AFTER express-session middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Message Middleware (requires session)
app.use(flash());

// Global variables for flash messages (optional but helpful for views)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Passport specific errors often use 'error'
  res.locals.user = req.user || null; // Make user available
  next();
});

// Import Route Files
const indexRoutes = require('./routes/index'); // Assuming index routes will be created
const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin'); // Assuming admin routes will be created

// Basic route for testing (can be removed or kept)
// app.get('/', (req, res) => {
//   console.log('User on / route:', req.user);
//   res.send('Server is running! Session and Passport configured.');
// });

// Mount Routes
app.use('/', indexRoutes); // Mount index routes
app.use('/', authRoutes); // Mount authentication routes
// app.use('/admin', adminRoutes);

// 404 Handler (should be after all routes)
app.use((req, res) => {
  res.status(404).send('404: Page Not Found'); // Simple 404 for now
});

// Error Handler (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500: Internal Server Error'); // Simple error response
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
}); 