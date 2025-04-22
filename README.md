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