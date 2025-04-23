const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true, trim: true }
});

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the Post model
module.exports = mongoose.model('Post', postSchema);