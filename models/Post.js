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

// Generate a slug from the title before saving
postSchema.pre('save', async function(next) {
    try {
        console.log('Generating slug for title:', this.title);
        if (this.isModified('title') || this.isNew) {
            this.slug = slugify(this.title, { lower: true, strict: true });
            console.log('Generated slug:', this.slug);
        }
        next();
    } catch (err) {
        console.error('Error generating slug:', err);
        next(err);
    }
});

// Validate the author
postSchema.pre('save', async function(next) {
    if (this.isNew && this.author) {
        try {
            console.log('Validating author ID:', this.author);
            const author = await User.findById(this.author);
            if (!author) {
                const err = new Error('Author not found for ID:', this.author);
                err.status = 400;
                return next(err);
            }
            console.log('Author validated:', author);
        } catch (err) {
            return next(err);
        }
    }
    next();
}
);

// Update the updatedAt field before saving
postSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;