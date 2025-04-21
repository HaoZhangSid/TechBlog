require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Import connectDB

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
}); 