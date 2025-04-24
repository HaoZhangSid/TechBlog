// config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Note: User model needs to be created later

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      console.log(`Passport LocalStrategy: Attempting to authenticate user: ${email}`);
      try {
        // Find user by email - Placeholder, uncomment when User model exists
        // const user = await User.findOne({ email: email.toLowerCase() });
        const user = null; // Placeholder
        if (!user) {
          console.warn(`Passport LocalStrategy: User not found for email: ${email}`);
          return done(null, false, { message: 'Invalid credentials' }); // Generic message
        }
        
        // Compare passwords - Placeholder, uncomment when User model exists
        /*
        console.log(`Passport LocalStrategy: Comparing password for user: ${email}`);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.warn(`Passport LocalStrategy: Password mismatch for user: ${email}`);
          return done(null, false, { message: 'Invalid credentials' });
        }
        */
       
        // Temporary success for structure setup (REMOVE LATER)
        if (password === 'password') { // Simple placeholder check
             console.log(`Passport LocalStrategy: Authentication successful for user: ${email}`);
             return done(null, { id: 'temp_id', email: email, name: 'Temp User', initials: 'TU' }); // Placeholder user
        } else {
             console.warn(`Passport LocalStrategy: Password mismatch for user: ${email}`);
             return done(null, false, { message: 'Invalid credentials' });
        }

        // Original success logic (Uncomment when User model and bcrypt work)
        // console.log(`Passport LocalStrategy: Authentication successful for user: ${email}`);
        // return done(null, user); 

      } catch (err) {
        console.error(`Passport LocalStrategy: Error during authentication for ${email}:`, err);
        return done(err);
      }
    }
  ));

  // Serialize user
  passport.serializeUser((user, done) => {
    console.log(`Passport serializeUser: Serializing user with ID: ${user.id}`);
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    console.log(`Passport deserializeUser: Attempting to deserialize user with ID: ${id}`);
    try {
      // Find user by ID - Placeholder, uncomment when User model exists
      // const user = await User.findById(id);
      const user = id === 'temp_id' ? { id: 'temp_id', email: 'temp@example.com', name: 'Temp User', initials: 'TU' } : null; // Placeholder
      
      if (user) {
        // Convert to plain object if necessary (depends on what findById returns)
        const plainUser = {
          id: user.id,
          name: user.name || 'Admin',
          email: user.email,
          initials: user.initials || (user.name ? user.name.charAt(0).toUpperCase() : 'A')
        };
        console.log(`Passport deserializeUser: Successfully deserialized user ID: ${id}`);
        done(null, plainUser);
      } else {
        console.warn(`Passport deserializeUser: User not found for ID: ${id}`);
        done(null, false); // Use false instead of null for Passport standard
      }
    } catch (err) {
      console.error(`Passport deserializeUser: Error deserializing user ID ${id}:`, err);
      done(err);
    }
  });
}; 