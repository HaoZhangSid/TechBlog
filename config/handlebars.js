// config/handlebars.js
const { engine } = require('express-handlebars');
const path = require('path');

const configureHandlebars = (app) => {
  app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main', // We'll create this layout later
    layoutsDir: path.join(__dirname, '../views/layouts'), // Standard layouts directory
    partialsDir: path.join(__dirname, '../views/partials'), // Standard partials directory
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      // Define helpers later as needed
      currentYear: function() {
        return new Date().getFullYear();
      },
      // Add other helpers from original project later...
    }
  }));

  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views')); // Set views directory
};

module.exports = configureHandlebars; 