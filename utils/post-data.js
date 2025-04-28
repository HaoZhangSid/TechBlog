require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Post = require('../models/Post');
const User = require('../models/User');
const slugify = require('slugify');

async function createPost() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database:', mongoose.connection.name);

    // Find a user to set as author
    const author = await User.findOne({ email: 'dexter199057@gmail.com' });
    if (!author) {
      throw new Error('No user found. Please create a user first.');
    }

    // Create new posts (multiple posts)
    const postData = [
        {
          title: 'Getting Started with Express and Handlebars',
          author: author._id,
          summary: 'Learn how to integrate Express with Handlebars for powerful server-side rendering.',
          content: `
            ## Introduction
            Handlebars is a popular templating engine that works well with Express.js. It allows you to create reusable template components with a simple syntax.

            ## Setting Up
            First, install the required packages:

            \`\`\`javascript
            npm install express express-handlebars
            \`\`\`

            Then, configure your Express app:

            \`\`\`javascript
            const express = require('express');
            const { engine } = require('express-handlebars');

            const app = express();

            app.engine('hbs', engine({
            extname: '.hbs',
            defaultLayout: 'main',
            }));

            app.set('view engine', 'hbs');
            \`\`\`

            ## Creating Templates
            Now you can create templates with the .hbs extension!
          `,
          published: true
        },
        {
          title: 'Markdown Comprehensive Guide and Examples',
          author: author._id,
          summary: 'Explore the various features of Markdown syntax, from basic formats to complete examples of advanced features.',
          content: `
            Markdown is a lightweight markup language created in 2004 and is now one of the most popular markup languages ​​in the world. It allows people to write documents in plain text formats that are easy to read and write, and then convert them into valid HTML documents.

            ## Basic syntax

            ### Title

            Markdown supports level 6 titles and uses the \`#\` symbol to represent:

            # Level 1 title
            ## Secondary title
            ### Level 3 title
            #### Level 4 title
            ##### Level 5 title
            ####### CET-6 title

            ### emphasize

            *This is italic text*
            _This is also italic text_

            **This is bold text**
            __This is also bold text__

            ***This is bold italic text***
            ___This is also a bold italic text___

            ### List

            #### Unordered List

            -Project 1
            -Project 2
            -Subproject A
            -Subproject B
            -Project 3

            #### Ordered List

            1. The first item
            2. Item 2
            1. Subproject A
            2. Subproject B
            3. Item 3

            ### Link
            [Plain text link](https://www.example.com)

            [Link with title](https://www.example.com "Link Title")

            ### picture

            ![Alternative Text](https://plus.unsplash.com/premium_photo-1670333242712-6e95c863592b?q=80&w=2613&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "Image Title")

            ## Advanced Syntax

            ### sheet

            | Header 1 | Header 2 | Header 3 |
            |--------|----------|
            | Cell 1,1 | Cell 1,2 | Cell 1,3 |
            | Cell 2,1 | Cell 2,2 | Cell 2,3 |
            | Cell 3,1 | Cell 3,2 | Cell 3,3 |

            ### Quote

            > This is a quote.
            >
            > This is the second paragraph quoted.
            >
            >> This is a nested reference.

            ### Code block

            Inline code: \`const greeting = "Hello World!"\`

            Code block:

            \`\`\`javascript
            //This is JavaScript code
            function greet(name) {
            return \`Hello, \${name}!\`;
            }

            console.log(greet('World'));
            //Output: Hello, World!
            \`\`\`

            \`\`\`python
            # This is Python code
            def greet(name):
                return f"Hello, {name}!"

            print(greet("World"))
            # Output: Hello, World!
            \`\`\`

            \`\`\`css
            /*This is the CSS code */
            body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
            }

            .container {
            max-width: 1100px;
            margin: 0 auto;
            overflow: auto;
            padding: 0 20px;
            }
            \`\`\`
            ### Task List

            -[x] Completed task
            -[ ] Task not completed
            -[ ] Another unfinished task

            ### Horizontal Line

            ---

            ### Footnote

            This is a text containing footnotes [^1].

            [^1]: This is the content of the footnote.

            ## In conclusion

            Markdown provides a simple and powerful way to format text, which is ideal for:

            1. Blog Posts
            2. Technical Documentation
            3. README file
            4. Forum discussion
            5. E-books

            Learning Markdown will greatly improve your writing efficiency and document quality!
          `,
          published: true
        },
        {
          title: 'Dark Mode in Modern Web Design',
          author: author._id,
          summary: 'Explore the implementation and benefits of dark mode in modern web applications.',
          content: 'The content of this blog post is here. Explore the implementation and benefits of dark mode in modern web applications.',
          published: true
        },
        {
          title: 'Building Responsive Layouts with Tailwind CSS',
          author: author._id,
          summary: 'A comprehensive guide to creating responsive designs using Tailwind CSS framework.',
          content: 'The content of this blog post is here. A comprehensive guide to creating responsive designs using Tailwind CSS framework.',
          published: true
        },
    ]

    // Create and save each post
    const newPosts = [];
    for (const data of postData) {
      console.log(`Creating post: ${data.title}`);
      const slug = slugify(data.title, { lower: true, strict: true });
      const post = new Post({
        ...data,
        slug: slug,
      });
      const savedPost = await post.save();
      newPosts.push(savedPost);
      console.log(`Post created successfully: ${savedPost.id}`);
    }

    // Verify all posts in the database
    console.log('\nVerifying created posts:');
    for (const savedPost of newPosts) {
      const retrievedPost = await Post.findById(savedPost._id).populate('author', 'name email');
      console.log(`Retrieved post: ${retrievedPost.title}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error creating post:', error.message);
    process.exit(1);
  }
}

createPost();