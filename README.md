# Tech Blog Project
This project is a simple tech blog platform built using Node.js, Express, Handlebars, and MongoDB. It features user authentication (login, password reset), post management (CRUD operations), and a public-facing blog interface.

## Features We Plan To Include

*   Public blog view (posts, comments)
*   User authentication (login, logout)
*   Password reset functionality (forgot password, reset link via email)
*   Admin dashboard (protected)
*   Post management (Create, Read, Update, Delete - currently using sample data)
*   Comment submission (currently redirects without saving)
*   Markdown support for post content with server-side rendering
*   Syntax highlighting for code blocks
*   TailwindCSS for styling
*   Responsive design

## Tech Stack To Be Used

*   **Backend:** Node.js, Express.js
*   **Templating:** Handlebars.js (`express-handlebars`)
*   **Database:** MongoDB
*   **Authentication:** Passport.js (Local Strategy)
*   **Styling:** TailwindCSS (with PostCSS)
*   **Email Sending:** Nodemailer (for password reset)
*   **Validation:** `express-validator`