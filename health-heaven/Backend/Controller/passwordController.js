const User = require('../models/Newuser'); // Import the User model
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail'); // Utility function for sending emails
const emailTemplate = require('../utils/test/emailTemplate'); // Import the email template

// Forgot Password Endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: 'Invalid email format.' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: 'User not found.' });

    // Generate 6-digit reset token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit number
    const tokenExpiry = Date.now() + 900000; // Token valid for 15 minutes (900000ms)

    // Store the reset token and expiry in the database
    user.resetToken = resetToken;
    user.tokenExpiry = tokenExpiry;
    await user.save();

    // Prepare reset link
    const resetLink = `${resetToken}`;

    // Generate the email HTML using the template
    const htmlContent = emailTemplate(user.name, resetLink);

    // Ensure user email is available
    if (!user.email) {
      return res.status(400).send({ message: 'Invalid email address.' });
    }

    
    // Send the email with HTML content
    await sendEmail({
      to: user.email, // Ensure this is correctly populated
      subject: 'Password Reset Request',
      text: 'Your OTP for password reset.',
      htmlContent: htmlContent,  // Pass the generated HTML content here
    });

    res.status(200).send({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error during forgotPassword process:', error);
    res.status(500).send({ message: 'An error occurred. Please try again.' });
  }
};

// Verify Token Endpoint
const verifyToken = async (req, res) => {
  const { token } = req.body;

  try {
    // Find user with matching reset token and not expired
    const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).send({ message: 'Invalid or expired token.' });

    res.status(200).send({ message: 'Token is valid.' });
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(500).send({ message: 'An error occurred. Please try again.' });
  }
};

// Reset Password Endpoint
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Password validation using regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).send({
      message: 'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.'
    });
  }

  try {
    // Find user with matching reset token and not expired
    const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).send({ message: 'Invalid or expired token.' });

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token and expiry
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();
    res.status(200).send({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send({ message: 'An error occurred. Please try again.' });
  }
};

module.exports = { forgotPassword, verifyToken, resetPassword };
