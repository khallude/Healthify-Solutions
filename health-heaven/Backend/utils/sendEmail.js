const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Create a transporter using Gmail's SMTP service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use the updated key
    pass: process.env.EMAIL_PASS, // Use the updated key
  },
});

// Send notification email
const sendEmail = async ({ to, subject, text, htmlContent }) => { 
  if (!to) {
    console.error('No recipient defined.');
    return; // Exit early if no recipient is defined
  }

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to, // Specify the recipient's email
    subject, // Subject of the email
    text,    // Plain-text body
    html: htmlContent,  // HTML content for the email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    console.error('Error stack trace:', error.stack);
  }
};

module.exports = sendEmail;