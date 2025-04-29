/**
 * Nodemailer Configuration
 * 
 * Configures email sending functionality, supporting both Gmail and test account modes
 */

const nodemailer = require('nodemailer');

/**
 * Create email transport
 * @returns {Object} Configured nodemailer transport object
 */
const createTransporter = () => {
  // Gmail configuration
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use Gmail App password
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates for development
    }
  });
};

/**
 * Create test account transporter (for development environment)
 * @returns {Promise<Object>} Configured test nodemailer transport object
 */
const createTestTransporter = async () => {
  // Create test account with Ethereal
  const testAccount = await nodemailer.createTestAccount();
  console.log('Test email account created:', testAccount.user);
  
  // Create test transporter
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name (optional)
 * @returns {Promise<Object>} Send result
 */
exports.sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    // In development environment, use test account if EMAIL_PASS is not set
    const useTestAccount = process.env.NODE_ENV !== 'production' && !process.env.EMAIL_PASS;
    
    let transporter;
    let previewUrl;
    
    if (useTestAccount) {
      transporter = await createTestTransporter();
    } else {
      transporter = createTransporter();
    }
    
    // Reset link URL
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Email options
    const mailOptions = {
      from: `"Tech Blog" <${useTestAccount ? transporter.options.auth.user : process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; color: #06b6d4;">Tech Blog</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
            <h2>Password Reset Request</h2>
            <p>Hello${userName ? ' ' + userName : ''},</p>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            
            <p>Or you can copy the following link to your browser address bar:</p>
            <p style="background-color: #eee; padding: 10px; word-break: break-all;">${resetUrl}</p>
            
            <p>This link will expire in 1 hour.</p>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p>Regards,<br>The Tech Blog Team</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #666; background-color: #f1f1f1;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    // If using test account, log the preview URL
    if (useTestAccount && info.messageId) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL: %s', previewUrl);
    }
    
    return { info, previewUrl };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

/**
 * Send welcome email
 * @param {string} email - Recipient email address
 * @param {string} userName - User's name
 * @returns {Promise<Object>} Send result
 */
exports.sendWelcomeEmail = async (email, userName) => {
  try {
    // In development environment, use test account if EMAIL_PASS is not set
    const useTestAccount = process.env.NODE_ENV !== 'production' && !process.env.EMAIL_PASS;
    
    let transporter;
    let previewUrl;
    
    if (useTestAccount) {
      transporter = await createTestTransporter();
    } else {
      transporter = createTransporter();
    }

    // Blog URL
    const blogUrl = process.env.APP_URL || 'http://localhost:3000';
    
    // Email options
    const mailOptions = {
      from: `"Tech Blog" <${useTestAccount ? transporter.options.auth.user : process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to Tech Blog!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #1a1a1a; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; color: #06b6d4;">Tech Blog</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd;">
            <h2>Welcome!</h2>
            <p>Hello ${userName || 'User'},</p>
            <p>Thank you for registering with Tech Blog. We're excited to have you join our community!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${blogUrl}" style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Visit Blog</a>
            </div>
            
            <p>At Tech Blog, you can:</p>
            <ul style="line-height: 1.6;">
              <li>Read the latest tech articles and tutorials</li>
              <li>Share your thoughts and comments</li>
              <li>Follow topics you're interested in</li>
            </ul>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Regards,<br>The Tech Blog Team</p>
          </div>
          
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #666; background-color: #f1f1f1;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    
    // If using test account, log the preview URL
    if (useTestAccount && info.messageId) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL: %s', previewUrl);
    }
    
    return { info, previewUrl };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
};

/**
 * Test email configuration
 * Used to verify email settings
 */
exports.testEmailConfig = async () => {
  try {
    // First try with configured transporter
    const transporter = createTransporter();
    const verified = await transporter.verify();
    return {
      success: true,
      message: 'Email configuration is valid'
    };
  } catch (error) {
    console.error('Email configuration error:', error.message);
    
    // If configured transporter failed, try with test account
    try {
      const testTransporter = await createTestTransporter();
      return {
        success: true,
        message: 'Using Ethereal test account for emails',
        testAccount: testTransporter.options.auth.user
      };
    } catch (testError) {
      return {
        success: false,
        message: 'All email configurations failed',
        error: error.message,
        testError: testError.message
      };
    }
  }
}; 