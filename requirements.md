# Project Specifications

## Backend Basic

*   [ ] Express.js server with routes for public pages, admin dashboard, and authentication.
*   [ ] Static file for public assets (CSS, JS).

## Database

*   [ ] Use MongoDB Atlas with Mongoose for data storage.
*   [ ] Models: Post (title, content, author, date) and User (username, email, password).

## Frontend

### Templates

*   [ ] Public Pages: Homepage (list of posts), post details page (single post), about page (static content) and error page.
*   [ ] Admin Pages: Admin dashboard, post list, post creation/edit form.
*   [ ] Authentication Pages: Login, forgot password, reset password form.
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

## CRUD API

*   [ ] RESTful API to create, read (list, single), update, delete posts.
*   [ ] Use authentication to protect write operations (post, put, delete).
*   [ ] Use express-validator to verify input data.

## Authentication

*   [ ] Passport.js Local Strategy for secure login, registration, logout, forgot password, and reset password.
*   [ ] Use bcryptjs for password hashing.
*   [ ] Protect admin routes and API write operations with ensureAuthenticated middleware. (Optional)

## Validation of Input Using Express-validator

*   [ ] Creation/editing of posts (title, text).
*   [ ] Reset password (new one, confirmation).

## Email Notifications with Nodemailer
*   [ ] An email containing a token link for a password reset.

## Deployment

*   [ ] Deploy to Azure App Service with MongoDB Atlas integration.
*   [ ] Set up production environment variables via Azure.
*   [ ] Continuous deployment from GitHub.

## Accessibility Compliance with WCAG 2.1 Level AA

*   [ ] 4.5:1 color contrast ratio.
*   [ ] Semantic HTML (e.g., nav, article).
*   [ ] ARIA properties such as aria-label, aria-describedby.
*   [ ] All interactive elements can be navigated using the keyboard.
*   [ ] Compatibility with screen reader (tested with NVDA, VoiceOver).
*   [ ] Markdown-rendered content is accessible.

---
