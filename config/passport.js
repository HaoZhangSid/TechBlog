// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path if necessary

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      console.log(`Passport LocalStrategy: Attempting authentication for ${email}`);
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          console.warn(`Passport: User not found - ${email}`);
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.warn(`Passport: Password mismatch for ${email}`);
          return done(null, false, { message: 'Invalid credentials' });
        }

        console.log(`Passport: Authentication successful for ${email}`);
        return done(null, user); // Return full user object
      } catch (err) {
        console.error(`Passport: Error during authentication for ${email}:`, err);
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    console.log(`Passport: Serializing user ID ${user.id}`);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log(`Passport: Deserializing user ID ${id}`);
    try {
      const user = await User.findById(id);
      if (user) {
        // Convert to plain object and ensure necessary properties
        const plainUser = {
          id: user.id,
          name: user.name || 'User', // Provide default name
          email: user.email,
          initials: user.initials || (user.name ? user.name.charAt(0).toUpperCase() : 'U') // Default initial
        };
        console.log(`Passport: User ${id} deserialized successfully.`);
        done(null, plainUser);
      } else {
        console.warn(`Passport: User not found during deserialization (ID: ${id})`);
        done(null, false); // Indicate user not found
      }
    } catch (err) {
      console.error(`Passport: Error deserializing user ID ${id}:`, err);
      done(err);
    }
  });
}; 