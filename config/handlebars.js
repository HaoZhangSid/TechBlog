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
      // Logical OR helper
      or: function(a, b) {
        return a || b;
      },
      // Current year helper
      currentYear: function() {
        return new Date().getFullYear();
      },
      // Format date helper
      formatDate: function(date, format) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
      },
      // Range helper (used for pagination)
      range: function(start, end) {
        let result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      },
      // Add helpers for math operations
      add: function(a, b) {
        return a + b;
      },
      multiply: function(a, b) {
        return a * b;
      },
      // Truncate text helper
      truncate: function(str, len) {
        if (!str) return '';
        if (str.length <= len) return str;
        return str.substring(0, len) + '...';
      },
      // Safe property lookup helper
      lookup: function(obj, prop) {
        if (!obj) return null;
        // Use Object.prototype.hasOwnProperty for security
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          return obj[prop];
        }
        return null;
      },
      // Safe assign helper for setting variables in templates
      assign: function(varName, varValue, options) {
        if (!options.data.root) {
          options.data.root = {};
        }
        options.data.root[varName] = varValue;
      }
    }
  }));

  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '../views'));
};

module.exports = configureHandlebars; 