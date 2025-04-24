require('dotenv').config();
const express = require('express');
const session = require('express-session'); // Import express-session
const MongoStore = require('connect-mongo'); // Import connect-mongo
const connectDB = require('./config/db'); // Import connectDB

// Connect to database
connectDB();

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

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running! Session configured.');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
}); 