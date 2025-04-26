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

// Pre-save hook to set the author field
postSchema.pre('save', async function(next) {
    if (this.isNew) {
        const user = await User.findById(this.author);
        if (!user) {
            return next(new Error('Author not found'));
        }
    }
    next();
});

// Update a slug when the title is modified
postSchema.pre('validate', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
}
);

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;