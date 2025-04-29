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