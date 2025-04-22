# Project Requirements

## Backend Basic

*   [ ] Express.js server with routes for public pages, admin dashboard, and authentication.
*   [ ] Static file serving for public assets (CSS, JS).

## Database

*   [ ] Use MongoDB Atlas with Mongoose for data storage.
*   [ ] Models: Post (title, content, author, date) and User (username, email, password).

## CRUD API

*   [ ] RESTful API (/api/posts, /api/posts/:id) supporting GET (list, single), POST (create), PUT (update), DELETE (delete).
*   [ ] Protect write operations (POST, PUT, DELETE) with authentication.
*   [ ] Validate input data using express-validator.

## Frontend

### Templates

*   [ ] Public Pages: Homepage (list of posts), post details page (single post), about page (static content), error page.
*   [ ] Admin Pages: Admin dashboard, post list, post creation/edit form.
*   [ ] Authentication Pages: Login/registration form, forgot password, reset password.
*   [ ] Layouts: Public layout, admin layout.

### Styling

*   [ ] Use Tailwind CSS v2.2.19 for responsive, modern design.
*   [ ] Google Fonts (Inter, JetBrains Mono) for typography.
*   [ ] Dark theme for admin dashboard with user dropdown and navigation (Posts, Logout).

### Markdown Rendering

*   [ ] Render post content as Markdown with syntax highlighting (CDN-hosted).
*   [ ] Include CDN scripts in public layout and add a server-side Handlebars helper.

### Client-Side Interactivity

*   [ ] Mobile menu toggle, user dropdown, and auto-hiding flash messages.

## Authentication

*   [ ] Passport.js Local Strategy for secure login, registration, logout, forgot password, and reset password.
*   [ ] Flash messages for user feedback (e.g., login errors, post creation success).
*   [ ] Use bcryptjs for password hashing.
*   [ ] Protect admin routes and API write operations with ensureAuthenticated middleware. (Optional)

## Email Notifications with Nodemailer
*   [ ] Password reset email with a token link.

## Input Validation with Express-validator

*   [ ] Post creation/edit (title, content).
*   [ ] User registration (username, email, password).
*   [ ] Password reset (new password, confirmation).

## Deployment

*   [ ] Deploy to Azure App Service with MongoDB Atlas integration.
*   [ ] Configure production environment variables via Azure.
*   [ ] Continuous deployment from GitHub.

## Accessibility Compliance with WCAG 2.1 Level AA

*   [ ] 4.5:1 color contrast ratio.
*   [ ] Semantic HTML (e.g., <nav>, <article>).
*   [ ] ARIA attributes (e.g., aria-label, aria-describedby).
*   [ ] Keyboard navigation for all interactive elements.
*   [ ] Screen reader compatibility (tested with NVDA, VoiceOver).
*   [ ] Accessible Markdown-rendered content.

---
