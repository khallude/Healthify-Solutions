module.exports = (fullName) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
          }
          .welcome-message {
            font-size: 18px;
            color: #007bff;
            margin-bottom: 20px;
          }
          .details {
            line-height: 1.6;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Health Heaven, ${fullName}!</h1>
          <p class="welcome-message">We're excited to have you join us!</p>
          <p class="details">
            You have successfully registered your account. Explore our platform to access resources and connect with our community.
          </p>
          <p class="footer">
            If you have any questions, feel free to reach out to our support team.<br>
            Regards,<br>
            The Health Heaven Team
          </p>
        </div>
      </body>
    </html>
  `;
};
