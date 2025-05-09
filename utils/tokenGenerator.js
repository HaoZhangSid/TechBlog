/**
 * Token generator tool
 * 
 * Used to generate and verify password reset tokens
 */

const crypto = require('crypto');

/**
 * Generate a random password reset token
 * @returns {string} Randomly generated reset token
 */
exports.generateResetToken = () => {
  // Generate a random string of 32 bytes and convert it to hexadecimal

  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash the token
 * storing hashed tokens instead of original tokens in the database, improving security
 * @param {string} token -Original Token
 * @returns {string} Hashed token
 */
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
}; 