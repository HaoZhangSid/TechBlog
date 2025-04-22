# Tech Blog Development Plan

This document outlines the planned phases for developing the Tech Blog application.

## Phase 1: Core Setup (Partially Complete)

*   [x] Initialize Node.js project (`package.json`).
*   [x] Setup basic Express server (`server.js`).
*   [x] Configure environment variables (`dotenv`, `.env`).
*   [x] Setup basic Git repository (`.gitignore`).
*   [x] Install `mongoose`.
*   [x] Implement database connection to **MongoDB Atlas** (`config/db.js`).
*   [ ] Define User model (`models/User.js`) with Mongoose schema (username, email, password).

## Phase 2: Authentication Foundation

*   [ ] Install core authentication packages (`passport`, `passport-local`, `bcryptjs`, `express-session`, `connect-mongo`).
*   [ ] Configure session management with `connect-mongo` persistence (using **MongoDB Atlas**).
*   [ ] Configure basic Passport setup (`config/passport.js`) - LocalStrategy, serialize/deserialize User.
*   [ ] Implement user registration/seeding mechanism (e.g., `utils/initAdmin.js` or a simple registration route initially).
*   [ ] Implement basic login route and controller (`routes/auth.js`, `controllers/authController.js`).
*   [ ] Implement logout route and controller.
*   [ ] Create a basic login view (`views/login.hbs`).
*   [ ] Create authentication middleware (`middleware/auth.js` - `ensureAuthenticated`).

## Phase 3: Templating & Basic Layout

*   [ ] Install `express-handlebars`.
*   [ ] Configure Handlebars view engine (`config/handlebars.js` or in `server.js`).
*   [ ] Create main layout file (`views/layouts/main.hbs`).
*   [ ] Create essential partials (`views/partials/common-head.hbs`, `views/partials/header.hbs`, `views/partials/footer.hbs`, `views/partials/common-scripts.hbs`).
*   [ ] Update `server.js` (or `routes/index.js`) to render a basic home page view using the layout.

## Phase 4: Public Blog Views

*   [ ] Define Post model (`models/Post.js` - title, slug, content, summary, author, published, etc.).
*   [ ] (Optional) Define Comment model (`models/Comment.js` - post, author, content).
*   [ ] Seed **MongoDB Atlas** database with sample posts (modify `sampleData.js` or create new seed script).
*   [ ] Implement index/public routes and controllers (`routes/index.js`, `controllers/indexController.js` for `/`, `/post/:slug`, `/about`).
*   [ ] Create corresponding views (`views/home.hbs`, `views/post-detail.hbs`, `views/about.hbs`).
*   [ ] Integrate Markdown rendering (using CDN Marked.js).
*   [ ] Integrate Syntax Highlighting (using CDN Highlight.js).

## Phase 5: Admin Area & Post Management (CRUD)

*   [ ] Create admin layout (`views/layouts/admin.hbs`).
*   [ ] Implement admin routes and controllers (`routes/admin.js`, `controllers/adminController.js` for dashboard, posts list, new/edit forms, delete).
*   [ ] Protect admin routes using `ensureAuthenticated` middleware.
*   [ ] Create admin views (`views/admin-dashboard.hbs`, `views/admin-posts-list.hbs`, `views/admin-post-form.hbs`).
*   [ ] Implement logic in admin controllers to interact with the Post model in **MongoDB Atlas** (create, read, update, delete posts).
*   [ ] Add flash messages for success/error feedback in admin actions.

## Phase 6: Styling with Tailwind CSS

*   [ ] Install Tailwind CSS and related dependencies (`tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/typography`).
*   [ ] Configure `tailwind.config.js` and `postcss.config.js`.
*   [ ] Setup main CSS file (`src/css/tailwind.css`) with `@tailwind` directives and custom imports.
*   [ ] Create build/watch scripts in `package.json` for CSS generation.
*   [ ] Apply Tailwind utility classes to views and partials.
*   [ ] Style Markdown output using `@tailwindcss/typography` and custom styles (`src/css/markdown.css`).
*   [ ] Implement responsive design adjustments.

## Phase 7: Enhancements & Polish

*   [ ] Implement comment submission logic (saving to Comment model in **MongoDB Atlas**).
*   [ ] Implement password reset functionality:
    *   [ ] Routes/Controllers/Views for forgot/reset password.
    *   [ ] Token generation/hashing (`utils/tokenGenerator.js`).
    *   [ ] Email sending setup (`nodemailer`, `utils/emailSender.js`, email templates).
*   [ ] Add server-side input validation (`express-validator`) to login, post forms, etc.
*   [ ] Implement client-side enhancements (e.g., mobile menu toggle, form feedback).
*   [ ] Add pagination for post lists (home page, admin posts list).
*   [ ] Refine accessibility (ARIA roles, labels, keyboard navigation).

## Phase 8: Testing & Deployment to Azure

*   [ ] Final testing in a production-like environment.
*   [ ] Configure production environment variables for **Azure App Service** .
*   [ ] Set up logging for production on **Azure App Service** .
*   [ ] Deploy to **Azure App Service**.

---
