require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

// Configuration Modules
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const configureHandlebars = require('./config/handlebars');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for secure cookies in production (e.g., behind Azure proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); 
}

// Configure Handlebars View Engine
configureHandlebars(app);

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Folder Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware with MongoStore
app.use(session({
  secret: process.env.SESSION_SECRET || 'a_very_strong_secret_fallback', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI, 
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' 
  }
}));

// Passport Middleware Initialization
configurePassport(passport); // Configure strategies, serialize/deserialize
app.use(passport.initialize());
app.use(passport.session()); // Use express-session for persistent login sessions

// Connect Flash Middleware
app.use(flash());

// Global Variables Middleware (for flash messages, user object)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Passport specific errors via failureFlash
  res.locals.user = req.user || null; // req.user populated by Passport deserializeUser
  next();
});

// Basic Test Route (Keep for now)
app.get('/', (req, res) => {
  // Later this will render a view
  res.send(`Server is running! Session ID: ${req.sessionID}, User: ${JSON.stringify(req.user)}`);
});

// Setup Routes (will be done in next phase)
// const indexRoutes = require('./routes/index');
// const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');
// app.use('/', indexRoutes);
// app.use('/', authRoutes);
// app.use('/admin', adminRoutes);

// Basic 404 Handler (will be improved later)
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Basic Error Handler (will be improved later)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Server Error');
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
}); 