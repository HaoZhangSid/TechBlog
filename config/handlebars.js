// Handlebars Configuration
const { engine } = require('express-handlebars');
const path = require('path');

const configureHandlebars = (app) => {
  app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      // Current year helper
      currentYear: function() {
        return new Date().getFullYear();
      },
      // Format date helper
      formatDate: function(date, format) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
      },
      // Truncate text helper
      truncate: function(str, len) {
        if (!str) return '';
        if (str.length <= len) return str;
        return str.substring(0, len) + '...';
      }
    }
  }));

  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views'));
};

module.exports = configureHandlebars; 