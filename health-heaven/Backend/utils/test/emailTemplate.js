module.exports = (userName, resetToken, resetLink) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .reset-link {
            color: #007bff;
            text-decoration: none;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f9f9f9;
          }
          .otp {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password. Please use the following OTP:</p>
          <p class="otp">${resetToken}</p> <!-- OTP displayed on its own line -->
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" class="reset-link">Reset Your Password</a> <!-- Reset link on its own line -->
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Regards,<br>Health Heaven Team</p>
        </div>
      </body>
    </html>
  `;
};
