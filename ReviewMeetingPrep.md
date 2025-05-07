# Tech Blog - Review Meeting Preparation

This document provides a comprehensive overview of the Tech Blog project, designed to help prepare for the review meeting and answer potential questions.

## 1. Project Overview & Goals

*   **Purpose**: A full-stack web application serving as a technical blog platform.
*   **Core Functionality**:
    *   Public-facing blog (view posts, homepage, about page).
    *   Admin area for managing blog posts (CRUD operations).
    *   User authentication for the admin area (Login, Logout, Password Reset).
*   **Architecture**: Model-View-Controller (MVC).
*   **Technology Base**: Node.js with the Express.js framework.

## 2. Technology Stack & Dependencies

*   **Backend Framework**: Express.js (`express`)
*   **Database**: MongoDB (Cloud: MongoDB Atlas)
*   **ODM (Object-Document Mapper)**: Mongoose (`mongoose`)
*   **Templating Engine**: Handlebars (`express-handlebars`)
*   **Authentication**: Passport.js (`passport`, `passport-local`) with session management (`express-session`, `connect-mongo`)
*   **Password Hashing**: bcryptjs (`bcryptjs`)
*   **Input Validation**: express-validator (`express-validator`)
*   **Email Notifications**: Nodemailer (`nodemailer`)
*   **HTTP Request Helpers**: `connect-flash` (for flash messages), `dotenv` (for environment variables)
*   **Utility Libraries**: `slugify` (for URL slugs)
*   **Frontend Styling**: Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)
*   **Frontend JS Libraries (via CDN)**: `marked.js` (Markdown parsing), `highlight.js` (syntax highlighting)
*   **Development Tools**: `nodemon` (auto-restart server), `concurrently` (run multiple scripts), `postcss-cli`

*(Reference: `package.json`)*

## 3. Project Architecture (MVC) & Directory Structure

The project follows the Model-View-Controller (MVC) pattern:

*   **Model**: Represents the data structure and business logic. Interacts with the database (MongoDB via Mongoose). Located in `/models`.
*   **View**: Responsible for the user interface. Uses Handlebars templates to render dynamic HTML. Located in `/views`.
*   **Controller**: Handles incoming requests, interacts with Models to fetch/manipulate data, and selects the appropriate View to render. Located in `/controllers`.

**Key Directories:**

*   `/config`: Configuration files (database connection, Passport setup, Handlebars engine, Nodemailer transport).
*   `/controllers`: Contains controller functions that handle request logic.
*   `/middleware`: Custom middleware functions (e.g., authentication checks).
*   `/models`: Mongoose schema definitions for database collections (User, Post).
*   `/public`: Static assets served directly to the client (compiled CSS, client-side JS, images).
*   `/routes`: Defines the application's routes and maps them to controller functions.
*   `/utils`: Utility functions (e.g., token generation, initial admin setup script).
*   `/views`: Handlebars template files (`.hbs`).
    *   `/layouts`: Main layout templates (`main.hbs`, `admin.hbs`).
    *   `/partials`: Reusable UI components (e.g., `header.hbs`).
*   `/src`: Source files before processing (e.g., Tailwind CSS source).
*   `/data`: Sample data files (used initially, now largely replaced by DB calls).
*   `server.js`: The main application entry point. Initializes Express, sets up middleware, connects to the DB, mounts routes, and starts the server.
*   `.env`: Stores environment variables (database URI, session secret, email credentials - *not committed to Git*).

## 4. Database Models & Configuration

*(Reference: `/models`, `/config/db.js`)*

*   **Mongoose**: Used as the ODM to interact with MongoDB Atlas.
*   **Connection (`config/db.js`)**: Establishes connection using `MONGODB_URI` from environment variables. Includes basic error handling.
*   **Models (`/models`)**:
    *   **`User.js`**: Defines the schema for users.
        *   Fields: `name` (String, required), `email` (String, required, unique, lowercase), `password` (String, required), `initials` (String), `createdAt` (Date), `resetPasswordToken` (String), `resetPasswordExpires` (Date).
        *   Middleware (`pre('save')`): Automatically hashes the password using `bcryptjs` before saving. Generates `initials` from `name` if not provided.
        *   Methods: `comparePassword` (used by Passport for login verification).
    *   **`Post.js`**: Defines the schema for blog posts.
        *   Fields: `title` (String, required), `author` (ObjectId, ref: 'User', required), `summary` (String, required), `createdAt` (Date), `updatedAt` (Date), `slug` (String, required, unique), `content` (String, required), `published` (Boolean).
        *   Middleware (`pre('save')`): Automatically generates a URL-friendly `slug` from the `title`. Updates the `updatedAt` timestamp.

## 5. Core Functionality Explained

### 5.1 Public Facing Pages

*(Reference: `/routes/index.js`, `/controllers/indexController.js`, `/views/*.hbs`)*

*   **Homepage (`/`)**: Displays a list of *published* blog posts.
    *   Route: `GET /` -> `indexController.getHomePage`
    *   Controller: Fetches posts where `published: true` from the DB, selecting necessary fields (`title`, `slug`, `summary`, `createdAt`), sorts by date descending, and renders `views/index.hbs`.
*   **Post Detail (`/post/:slug`)**: Displays a single blog post.
    *   Route: `GET /post/:slug` -> `indexController.getPostBySlug`
    *   Controller: Fetches the post matching the `slug` from the DB. Renders `views/post-details.hbs`.
    *   View (`post-details.hbs`): Displays post content. Uses client-side JavaScript with `marked.js` and `highlight.js` (loaded via CDN in `main.hbs` layout) to render Markdown content and apply syntax highlighting. Uses `{{post.content}}` to avoid server-side Handlebars interpretation issues.
*   **About Page (`/about`)**: Displays static content.
    *   Route: `GET /about` -> `indexController.getAboutPage`
    *   Controller: Renders `views/about.hbs`.

### 5.2 Authentication Flow

*(Reference: `/routes/auth.js`, `/controllers/authController.js`, `/config/passport.js`, `/middleware/auth.js`, `/models/User.js`, `/utils/tokenGenerator.js`, `/config/nodemailer.js`, `/views/login.hbs`, `/views/forgot-password.hbs`, `/views/reset-password.hbs`)*

*   **Strategy**: Passport.js with the `passport-local` strategy (email/password).
*   **Configuration (`config/passport.js`)**: Configures the Local Strategy to find a user by email, compare the submitted password with the hashed password in the DB using `bcryptjs`. Handles serialization (saving user ID to session) and deserialization (fetching user from DB based on session ID).
*   **Session Management (`server.js`)**: Uses `express-session` with `connect-mongo` to store session data in MongoDB, preventing session loss on server restart. Configures session secret, cookie properties (`maxAge`, `httpOnly`, `secure` in production).
*   **Login (`/login`)**: `GET` displays the form, `POST` handles the attempt.
    *   `POST /login` uses `express-validator` for basic input checks (email format, password required).
    *   Passport's `authenticate('local', ...)` middleware handles the core logic, comparing credentials and managing session/redirects. Uses `connect-flash` for error/success messages.
*   **Logout (`/logout`)**: `POST` destroys the user session via `req.logout()`.
*   **Password Reset (`/forgot-password`, `/reset-password/:token`)**: Multi-step process.
    1.  **Forgot Password (`POST /forgot-password`)**: Validates email. Finds user. Generates a secure random token (`utils/tokenGenerator.js -> generateResetToken`), hashes it (`hashToken`), stores the hash and expiry date on the User model. Sends an email (`config/nodemailer.js -> sendPasswordResetEmail`) containing a link with the *original* (unhashed) token to the user's email.
    2.  **Reset Password Page (`GET /reset-password/:token`)**: User clicks link. Controller hashes the token from the URL, finds the user with the matching hashed token and valid expiry date. Renders the reset password form if valid.
    3.  **Reset Password Submit (`POST /reset-password/:token`)**: Validates new password (length, match). Finds user by hashed token again. Updates the user's password (the `User` model's pre-save hook handles hashing the new password). Clears the reset token fields from the User model. Redirects to login.
*   **Route Protection (`middleware/auth.js -> isAuthenticated`)**: Middleware applied to all `/admin` routes. Checks `req.isAuthenticated()`. If true, calls `next()` to proceed. If false, sets a flash message and redirects to `/login`. (The `ERR_HTTP_HEADERS_SENT` error was fixed here by adding `return;` after `res.redirect`).

### 5.3 Admin Area

*(Reference: `/routes/admin.js`, `/controllers/adminController.js`, `/views/admin-dashboard.hbs`, `/views/posts.hbs`, `/views/post-form.hbs`)*

*   **Access**: All routes under `/admin` are protected by the `isAuthenticated` middleware.
*   **Layout**: Uses a separate layout file (`views/layouts/admin.hbs`).
*   **Dashboard (`/admin/dashboard`)**: Displays basic statistics.
    *   Route: `GET /admin/dashboard` -> `adminController.getDashboard`
    *   Controller: Fetches the total post count (`Post.countDocuments()`) and renders `views/admin-dashboard.hbs`.
*   **Post Management (CRUD)**:
    *   **List Posts (`/admin/posts`)**: Displays a table of all posts.
        *   Route: `GET /admin/posts` -> `adminController.getPosts`
        *   Controller: Fetches all posts using `Post.find()`, populates author username, renders `views/posts.hbs`.
        *   View (`posts.hbs`): Displays posts in a table with columns for Title/Slug, Date, Status, and Actions (Edit, View, Delete). Implemented fixes for column width issues.
    *   **Create Post (`/admin/posts/create`)**: `GET` displays the form, `POST` handles submission.
        *   Route: `GET /admin/posts/create` -> `adminController.getCreatePost`
        *   Route: `POST /admin/posts/create` -> `adminController.postCreatePost`
        *   Controller (`POST`): *Needs validation improvement (see Security)*. Creates a slug from the title. Creates a new `Post` instance with data from `req.body` and `req.user.id`. Saves to DB.
        *   View (`post-form.hbs`): Contains fields for title, slug, summary, content (textarea), and published status (checkbox). Includes Markdown preview toggle feature.
    *   **Edit Post (`/admin/posts/edit/:id`)**: `GET` displays the form pre-filled, `POST` handles update.
        *   Route: `GET /admin/posts/edit/:id` -> `adminController.getEditPost`
        *   Route: `POST /admin/posts/edit/:id` -> `adminController.postEditPost`
        *   Controller (`GET`): Fetches the post by `_id`. Renders `views/post-form.hbs` with post data.
        *   Controller (`POST`): *Needs validation improvement*. Finds post by `_id`. Updates fields using `Post.findByIdAndUpdate()`. Saves changes.
    *   **Delete Post (`/admin/posts/delete/:id`)**: `POST` handles deletion.
        *   Route: `POST /admin/posts/delete/:id` -> `adminController.postDeletePost`
        *   Controller: Finds and deletes post by `_id` using `Post.findByIdAndDelete()`.

## 6. Configuration Files Explained

*   **`server.js`**: Orchestrates the application setup. Loads environment variables, connects DB, configures Passport, sets up Handlebars, defines middleware order (crucial!), mounts routes, sets up 404 and final error handler, starts the server.
*   **`config/db.js`**: Handles `mongoose.connect()` logic using `MONGODB_URI`.
*   **`config/passport.js`**: Contains all Passport strategy configuration, serialization, and deserialization logic.
*   **`config/handlebars.js`**: Configures the `express-handlebars` engine, sets layout/partials directories, defines custom helpers (`formatDate`, `truncate`, `currentYear`, etc.).
*   **`config/nodemailer.js`**: Sets up the email transport (using Gmail credentials or Ethereal for testing) and provides functions (`sendPasswordResetEmail`, etc.) to send specific emails.

## 7. Security Considerations

*   **Authentication/Authorization**: Handled by Passport and the `isAuthenticated` middleware. Prevents unauthenticated access to admin areas.
*   **Password Storage**: Passwords are never stored in plain text. `bcryptjs` is used to hash passwords securely before saving them to the database (`User` model pre-save hook).
*   **Input Validation**: `express-validator` is used for basic validation on authentication routes (`auth.js`). **Improvement Needed**: Validation for post creation/editing (`adminController.js`) is currently very basic (simple existence checks with logical flaws) and lacks sanitization. The code includes comments acknowledging this (`// Validate input (to be improved with a express-validator)`).
*   **Session Security**: Uses `express-session` with a secret key stored in `.env`. `connect-mongo` stores sessions in the database. Cookies are configured with `httpOnly` (prevents client-side script access) and `secure: true` (only sent over HTTPS) in production.
*   **Cross-Site Scripting (XSS)**: Handlebars automatically escapes HTML in `{{variable}}` expressions. Using `{{{variable}}}` bypasses escaping. We corrected the use in `post-details.hbs` from `{{{post.content}}}` to `{{post.content}}` to prevent server-side Handlebars issues and rely on client-side `marked.js`. **Consideration**: If user-generated content rendered via `marked.js` could contain malicious scripts, the output HTML from `marked.parse()` should ideally be sanitized using a library like `DOMPurify` before being injected into the DOM.
*   **Cross-Site Request Forgery (CSRF)**: Currently, there's no explicit CSRF protection implemented (e.g., using tokens via `csurf` middleware). This is a potential vulnerability, especially for admin actions performed via forms (`POST` requests).
*   **Rate Limiting**: No rate limiting is implemented on login or password reset attempts, making them potentially vulnerable to brute-force attacks.
*   **Security Headers**: Does not currently use middleware like `helmet` to set various security-related HTTP headers (e.g., `X-Frame-Options`, `Strict-Transport-Security`).

## 8. Frontend Details

*   **Styling**: Tailwind CSS utility-first framework. Configuration in `tailwind.config.js`. Source CSS in `/src/css`, compiled using `postcss` (see `package.json` scripts) into `/public/css/styles.css`.
*   **Templating**: Handlebars (`.hbs` files in `/views`). Uses layouts (`main.hbs`, `admin.hbs`) and partials (`header.hbs`). Custom helpers defined in `config/handlebars.js` are used for date formatting, text truncation, etc.
*   **Client-Side JavaScript**:
    *   **Markdown Rendering**: `post-details.hbs` uses `marked.js` (via CDN) to parse Markdown stored as text and `highlight.js` (via CDN) for syntax highlighting within code blocks. Logic is inside a `<script>` tag on the page.
    *   **Markdown Preview**: `post-form.hbs` includes a preview toggle feature using JavaScript to render the content of the textarea using `marked.js` and `highlight.js` (loaded via CDN in `admin.hbs` layout).
    *   **Slug Generation**: `post-form.hbs` includes a simple script to auto-generate a slug from the title field on blur if the slug field is empty.
    *   **Flash Message Auto-Dismiss**: `main.hbs` includes a script to automatically hide flash messages after a few seconds.

## 9. Deployment

*   **Target Platform**: Azure App Service (as indicated in `requirements.md`).
*   **Database**: MongoDB Atlas (Cloud-hosted).
*   **Environment Variables**: Critical configuration (DB URI, session secret, email creds, port) managed via `.env` locally and Azure App Service application settings in production.
*   **Continuous Deployment**: A GitHub Actions workflow file exists (`.github/workflows/main_techblog.yml`), suggesting CI/CD setup from GitHub to Azure is intended or implemented.

## 10. Potential Questions & Answer Pointers

*   **"Explain the overall architecture."**
    *   Talk about MVC: Models (Mongoose schemas), Views (Handlebars templates), Controllers (request handling logic).
    *   Mention key directories and their purpose.
    *   Explain the role of `server.js` as the entry point.
*   **"Walk me through the login process."**
    *   User submits email/password (`POST /login`).
    *   `express-validator` checks input.
    *   `passport.authenticate('local')` is called.
    *   Passport strategy (`config/passport.js`) finds user by email.
    *   Compares hashed password using `bcrypt.compare`.
    *   If match: `passport.serializeUser` saves user ID to session, redirects to dashboard.
    *   If no match/error: Redirects back to login with flash message.
*   **"How is Markdown content handled?"**
    *   Stored as plain text in the `content` field of the `Post` model.
    *   **Post Detail Page (`post-details.hbs`)**: Controller sends the raw Markdown text to the template within the `post` object. Template uses `{{post.content}}` (double braces to avoid server-side parsing issues). Client-side JavaScript (in `<script>` tag) uses `marked.js` (CDN) to parse the content of the `.markdown-content` div and `highlight.js` (CDN) for syntax highlighting.
    *   **Post Form (`post-form.hbs`)**: Includes a preview toggle. JavaScript uses `marked.js` and `highlight.js` (loaded in `admin.hbs` layout via CDN) to render the textarea content in a hidden preview div when the button is clicked.
*   **"What security measures are in place?"**
    *   Mention: Password hashing (bcryptjs), session-based authentication (Passport), route protection (`isAuthenticated`), `httpOnly`/`secure` cookies.
    *   Acknowledge areas for improvement: Lack of CSRF protection, need for more robust input validation/sanitization (especially for posts), no rate limiting, could add security headers (Helmet).
*   **"How does the password reset feature work?"**
    *   Explain the 3 steps: Request (generate/hash/store token, send email with *original* token), Verification (user clicks link, server finds user by *hashed* token), Reset (validate new password, update DB, clear token).
    *   Mention token hashing for security (DB stores hash, email link has original).
*   **"What are Handlebars helpers used for in this project?"**
    *   Refer to `config/handlebars.js`: Date formatting (`formatDate`), text truncation (`truncate`), getting the current year (`currentYear`), basic logic (`or`), math (`add`, `multiply`), safe property lookup (`lookup`), variable assignment (`assign`).
*   **"How would you improve the validation for creating/editing posts?"**
    *   Explain the current limitations (basic existence checks, flawed logic).
    *   Suggest using `express-validator` middleware directly in the route definition (`routes/admin.js`) or at the start of the controller function (`adminController.js`), similar to how it's done in `routes/auth.js`.
    *   Mention adding specific checks: length constraints (`isLength`), format checks (if applicable), and importantly, sanitization (`trim`, `escape`, potentially using a dedicated HTML sanitizer if content allows HTML).
*   **"What does the `.lean()` method do in Mongoose queries?"**
    *   Explain that it tells Mongoose to return plain JavaScript objects instead of full Mongoose documents. This improves performance, especially when just reading data for rendering in templates, as it avoids the overhead of Mongoose's change tracking, virtuals, methods, etc.
*   **"Explain the purpose of the different layout files (`main.hbs`, `admin.hbs`)."**
    *   `main.hbs`: Used for public-facing pages. Includes common header, footer, flash messages, loads necessary CDN scripts for Markdown rendering.
    *   `admin.hbs`: Used for admin area pages. Includes header (with admin-specific elements), flash messages (different styling/position possible), *doesn't* include the public footer, loads necessary CDN scripts for admin features (like Markdown preview).

Good luck with your review meeting! Let me know if you want clarification on any specific part. 