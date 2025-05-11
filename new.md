# Code-Driven Presentation Script: Backend Logic for Post Management

**Presenter**: Student
**Audience**: Professor
**Presentation Environment**: Student's laptop, showing code directly to Professor face-to-face.

---

## Introduction

**Student (Say)**: "Hi Professor, thanks for looking at this with me. I'll walk you through the backend logic for the post management system by showing you the code directly on my screen. We'll go through the key files and I'll explain how they work together."

**Student (Say)**: "The main goal was to implement CRUD operations for blog posts, using Node.js, Express, Mongoose for MongoDB, and Handlebars for a simple admin interface."

---

## Part 1: The Post Model - The Blueprint for Posts (`models/Post.js`)

**Student (Action)**: "First, let's look at the foundation, which is the Post model. I'm opening `models/Post.js` now on my screen."
**(Student opens `models/Post.js` on their screen, ensuring the Professor can see it clearly)**

**Student (Highlighting/Guidance)**: "Here, the `postSchema` – this `mongoose.Schema` definition I'm pointing to – defines the structure of a post in our database. As you can see, I've defined fields like:"
*   "`title`: A required string for the post's title."
*   "`author`: This is a Mongoose ObjectId, and it's a reference to our 'User' model – you can see `ref: 'User'` here. It's a required link to the user who wrote the post."
*   "`summary`: A required string for a brief overview."
*   "`content`: The main body of the post, also required."
*   "`slug`: This is a URL-friendly version of the title, which I've made required and unique. It's automatically generated, as we'll see in a moment."
*   "`published`: A boolean flag, defaulting to false, to control public visibility."
*   "And `createdAt` and `updatedAt`: These are timestamps that Mongoose handles for us, defaulting to `Date.now`."

**Student (Highlighting/Guidance)**: "Now, I'm scrolling down in the same file to show you two `postSchema.pre('save', ...)` functions. These are Mongoose hooks that run automatically before a post is saved."

**Student (Highlighting/Guidance)**: "This first one here, the one that includes a call to the `slugify` library:"
**Student (Say)**: "This hook automatically creates the `slug` from the `title`. It runs if the post is new or if the title has been modified. This keeps our URLs clean and consistent without needing manual slug creation in the controllers."

**Student (Highlighting/Guidance)**: "And the second `pre('save')` hook just below it, the one that calls `User.findById(...)` inside its try-catch block:"
**Student (Say)**: "This hook validates the author. When a *new* post is being saved, it checks if the provided `author` ID actually exists in our `Users` collection. It's a data integrity check to ensure every post is linked to a valid author before it hits the database."

---

## Part 2: Middleware - Reusable Helpers (`middleware/auth.js` and an example from a route file)

**Student (Say)**: "Next, let's look at some reusable helper functions – our middleware."

**Student (Action)**: "I'll open `middleware/auth.js` on my screen now."
**(Student opens `middleware/auth.js`)**

**Student (Highlighting/Guidance)**: "The `isAuthenticated` function here is key for security. I'm pointing to it now."
**Student (Say)**: "It checks if `req.isAuthenticated()` is true (which is usually handled by an authentication library like Passport.js). If the user isn't logged in, it flashes an error message using `req.flash` – see here – and then redirects them to the `/login` page. I use this middleware in my routes to protect actions that should only be accessed by authenticated users."

**Student (Say)**: "For input validation, I'm using the `express-validator` library. The rules are typically defined as an array. Let me show you an example of this in one of our route files."

**Student (Action)**: "I'm opening `routes/api/posts.js` now."
**(Student opens `routes/api/posts.js`)**

**Student (Highlighting/Guidance)**: "Near the top of this file, you can see the `postValidation` array I'm highlighting. It's a collection of rules from `express-validator`."
**Student (Say)**: "This array defines all the validation rules for creating or editing a post. For example, for the `title` – see this line – it checks that it's not empty, it's within a certain length, and I've even added a `customSanitizer` to remove any Markdown heading symbols if a user types them in. We use similar validation rules in the admin controller as well for consistency across different parts of the application."

---

## Part 3: The API - Programmatic Interaction (`routes/api/posts.js`)

**Student (Say)**: "We still have `routes/api/posts.js` open on my screen. This file handles all the API endpoints for posts, allowing other programs or a frontend to interact with our post data programmatically."

**Student (Highlighting/Guidance)**: "Let's look at the `router.post('/', ...)` route handler – I'm pointing to it now. This is for creating a new post via the API."
**Student (Say)**: "You can see as arguments to `router.post`, it uses the `isAuthenticated` middleware we just saw, and then our `postValidation` rules. Inside the asynchronous handler function, it first checks for any validation errors from `express-validator`. If the data is valid, it extracts the `title`, `summary`, etc., from `req.body`, generates a `slug` using `slugify`, creates a new `Post` model instance (importantly, assigning `req.user.id` as the `author`), and then calls `newPost.save()` to store it in MongoDB. This save operation will also trigger those pre-save hooks in the Post model we looked at earlier. Finally, if successful, it sends back a `201 Created` status with the new post data."

**Student (Say)**: "This file also contains other standard RESTful endpoints, which I can scroll through if you'd like:"
*   "`GET /api/posts`: Fetches all posts, and you can see it uses `.populate('author', 'username')` to include author details."
*   "`GET /api/posts/:id`: Fetches a single post by its ID, also populating author details."
*   "`PUT /api/posts/:id`: Updates an existing post."
*   "And `DELETE /api/posts/:id`: Deletes a post."

**Student (Highlighting/Guidance)**: "For both the `PUT` and `DELETE` routes, there's an important authorization check. I'm scrolling to the `router.put('/:id', ...)` handler now. Please look at this `if` condition I'm highlighting: `if (post.author.toString() !== req.user.id.toString())`."
**Student (Say)**: "This code ensures that only the original author of the post can edit or delete it through the API. If the IDs don't match, it sends a `403 Forbidden` error, preventing unauthorized modifications."

---

## Part 4: The Admin Panel - Web Interface (`controllers/adminController.js` and `routes/admin.js`)

**Student (Say)**: "Now let's look at the admin panel. This provides a web interface for managing posts."

**Student (Action)**: "I'll open `controllers/adminController.js` first, as this contains most of the logic for the admin actions."
**(Student opens `controllers/adminController.js`)**

**Student (Highlighting/Guidance)**: "Let's take `exports.postCreatePost` as an example. I'm showing it on screen now. This function handles the form submission when an admin creates a new post."
**Student (Say)**: "Notice that this exported function is an array: `[...postValidation, async (req, res) => { ... }]`. The `postValidation` rules (which are similar to the API ones) are spread into it, so they execute before the main asynchronous request handler. If validation passes, the handler extracts the form data, correctly converts the 'published' checkbox value from the string 'on' to a boolean `true`, generates a slug, creates a new `Post` instance (again, using `req.user.id` as the author), saves it, flashes a success message using `req.flash`, and redirects the admin to the list of posts. Error handling will redirect back to the form with an error message flashed to the user."

**Student (Say)**: "This `adminController.js` file also has functions for other admin actions, which I can scroll to:"
*   "`getPosts`: To display the list of all posts in the admin area."
*   "`getCreatePost`: To render the 'new post' form."
*   "`getEditPost`: To render the 'edit post' form, pre-filled with existing data."
*   "`postEditPost`: To handle the submission of the edit form."
*   "And `postDeletePost`: To handle the deletion of a post."

**Student (Action)**: "Briefly, I'll also open `routes/admin.js` to show how these controllers are used."
**(Student opens `routes/admin.js`)**

**Student (Highlighting/Guidance)**: "This file defines the routes for the admin section, like `/admin/posts`, `/admin/posts/create`, etc. – you can see them here. It maps these routes to the controller functions we just saw in `adminController.js`. You can also see the `isAuthenticated` middleware being applied to these routes here, protecting the entire admin area."

**Student (Say)**: "A key point for discussion, which I also noted in my earlier thoughts, is that the admin edit (`postEditPost`) and delete (`postDeletePost`) functions in `controllers/adminController.js` currently *do not* check if the logged-in admin is the actual author. This means any admin can modify or delete any post. This is different from how the API handles it, and I'd like your feedback on whether this is the intended behavior for admins or if it should have author restrictions too."

**Student (Highlighting/Guidance)**: "Also, if we look back at `exports.postEditPost` in `controllers/adminController.js` – I'm switching back to that file now – the current update logic uses `Post.findByIdAndUpdate()` followed by `post.save()`. I'm considering refactoring this to a more standard fetch-modify-save pattern for better clarity and to ensure Mongoose hooks run as expected. That's another area I'd appreciate your input on."

---

## Part 5: Public View - How Visitors See Posts (`controllers/indexController.js` and `routes/index.js`)

**Student (Say)**: "Finally, let's see how the public-facing site displays posts."

**Student (Action)**: "I'm opening `controllers/indexController.js`."
**(Student opens `controllers/indexController.js`)**

**Student (Highlighting/Guidance)**: "The `exports.getHomePage` function, which I'm pointing to, is responsible for the homepage."
**Student (Say)**: "It fetches posts from the database, but importantly, it only gets those where the `published` field is `true` – see the query condition here. It also uses `.select()` to pick only the fields needed for the homepage list (like title, slug, summary) and sorts them by creation date, newest first. Then it renders the `index` Handlebars template with this data."

**Student (Highlighting/Glosuidance)**: "Next, the `exports.getPostBySlug` function in the same file."
**Student (Say)**: "This handles displaying a single post when a user navigates to a URL like `/post/my-awesome-article`. It finds the post in the database using the `slug` from the URL. If no post matches, it renders a 404 error page. Otherwise, it renders the `post-details` template with the full post data. I've noted that this currently doesn't populate author details, which might be a good addition to show who wrote the post."

**Student (Action)**: "And quickly, I'll open `routes/index.js`."
**(Student opens `routes/index.js`)**

**Student (Highlighting/Guidance)**: "This file, as you can see, sets up the public routes, like `/` for the homepage and `/post/:slug` for single posts, and maps them to those controller functions in `indexController.js` we just looked at."

---

## Part 6: Utility Script for Sample Data (Optional Mention - `utils/post-data.js`)

**Student (Say)**: "I also have a script in `utils/post-data.js`. We don't need to open it unless you're curious, but it's a helper I wrote to quickly add some sample posts to the database for testing during development. It's not part of the main application flow."

---

## Part 7: Conclusion and Key Discussion Points

**Student (Say)**: "So, that's a walkthrough of the main components of the post management backend. The key areas I'd appreciate your feedback on are:"
*   "First, the admin authorization for editing and deleting posts: Should admins have unrestricted control, or should it be limited to post authors, similar to how the API works?"
*   "Second, the update logic in `adminController.postEditPost`: I plan to refactor this to a cleaner fetch-modify-save pattern for consistency and to ensure hooks run reliably."
*   "And third, whether we should add author details, like their username, to the public-facing single post display for a richer user experience."

**Student (Say)**: "I'm now ready for any questions or suggestions you might have. Thanks for your time!"

---
