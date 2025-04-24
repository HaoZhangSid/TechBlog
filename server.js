require('dotenv').config();
const express = require('express');
const session = require('express-session'); // Import express-session
const MongoStore = require('connect-mongo'); // Import connect-mongo
const passport = require('passport'); // Import passport
const connectDB = require('./config/db'); // Import connectDB
const configurePassport = require('./config/passport'); // Import passport config

// Connect to database
connectDB();

// Configure Passport Strategy
configurePassport(passport);

const app = express();
const PORT = process.env.PORT || 3000;

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

// Basic route for testing
app.get('/', (req, res) => {
  // Check if user is authenticated (will be undefined until login)
  console.log('User on / route:', req.user);
  res.send('Server is running! Session and Passport configured.');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
}); 