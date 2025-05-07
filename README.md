# Tech Blog Project
This project is a straightforward tech blog platform that was constructed with MongoDB, Handlebars, Express, and Node.js.  It has a blog interface that is visible to the public, post management (CRUD operations), and user authentication (login, password reset).

## Features That We Incorporate

*   View of the public blog (posts, comments)
*   Authentication of users (login, logout)
*   Features for changing a password (forgot password, reset link via email)
*   Administrator dashboard (secured)
*   Post management (Create, Read, Update, Delete)
*   Submission of comments (optional)
*   Support for markdown for server-side rendering of post content
*   Syntax highlighting for code blocks
*   Use TailwindCSS for styling
*   Design that is responsive

## Utilizing Tech Stack

*   **Backend:** Node.js and Express.js
*   Handlebars.js (`express-handlebars`) to be used for template creation.
*   **Database:** MongoDB
*   Passport.js (Local Strategy) for authentication.
*   TailwindCSS (with PostCSS) to be used for styling.
*   Nodemailer to be used to send emails for password reset.
*   `Express-validator` to be used for validation.

## Email Configuration

The application uses Nodemailer to send welcome emails and password reset emails. To set up the email functionality:

### For Gmail

1. Create a Gmail account or use an existing one
2. Enable 2-Step Verification for your Google account
3. Generate an App Password:
   - Go to your Google Account settings
   - Select "Security"
   - Under "Signing in to Google," select "App passwords"
   - Generate a new app password for "Mail" and your application
4. Configure the following environment variables:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password_here
   EMAIL_FROM=your.email@gmail.com
   APP_URL=http://localhost:3000
   ```

### For Development (Without Real Emails)

If you don't configure an email account, the application will automatically use Ethereal Email for testing in development mode. This allows you to view sent emails through their web interface without actually sending them.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tech-blog

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Application URL (for generating links in emails)
APP_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your.email@gmail.com
```

## Initial Admin Setup

To create the initial administrator account, run the following command in your terminal after setting up your `.env` file:

```bash
npm run init-admin
```

This script will create a default admin user if one doesn't already exist with the following credentials:

*   **Email:** `dexter199057@gmail.com`
*   **Password:** `qwer1234`

**Important:** For security reasons, log in with these default credentials immediately after running the script and **change the password** through the appropriate admin interface (if available) or directly in the database.

## API Endpoints

### Public Routes

*   `GET /`: Displays the homepage with a list of published posts.
*   `GET /post/:slug`: Displays the detail page for a single post.
*   `GET /about`: Displays the about page.

### Authentication Routes

*   `GET /login`: Displays the login form.
*   `POST /login`: Handles user login attempts.
*   `GET /forgot-password`: Displays the forgot password form.
*   `POST /forgot-password`: Handles the request to send a password reset email.
*   `GET /reset-password/:token`: Displays the password reset form (requires a valid token).
*   `POST /reset-password/:token`: Handles the submission of the new password.
*   `POST /logout`: Logs the user out.

### Admin Routes (Require Authentication)

*   `GET /admin/dashboard`: Displays the admin dashboard.
*   `GET /admin/posts`: Displays a list of all posts.
*   `GET /admin/posts/create`: Displays the form to create a new post.
*   `POST /admin/posts/create`: Handles the creation of a new post.
*   `GET /admin/posts/edit/:id`: Displays the form to edit an existing post.
*   `POST /admin/posts/edit/:id`: Handles the update of an existing post.
*   `POST /admin/posts/delete/:id`: Handles the deletion of a post.