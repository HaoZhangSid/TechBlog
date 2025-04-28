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
        try {
            const user = await User.findById(this.author);
            if (!user) {
                return next(new Error('Author not found'));
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Pre-save hook to set the slug field and updatedAt field
postSchema.pre('save', async function(next) {
    try {
        if (this.isNew || this.isModified('title')) {
            let baseSlug = slugify(this.title, { lower: true, strict: true });
            let slug = baseSlug;
            let count = 1; // Initialize count for slug uniqueness
            while (await Post.findOne({ slug, _id: { $ne: this._id } })) {
                // If slug already exists, append a number to make it unique and increment count
                slug = `${baseSlug}-${count}`;
                count++;
            }
            this.slug = slug;
        }
        this.updatedAt = new Date();
        next();
    } catch (error) {
        next(error);
    }
});

// Export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;