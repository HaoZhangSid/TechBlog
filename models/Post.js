const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true, trim: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: false }
});

// Pre-save hook to generate a slug from the title
postSchema.pre('save', function(next) {
    if (this.isModified('title') || this.isNew) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

// Pre-save hook to update the updatedAt field
postSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;