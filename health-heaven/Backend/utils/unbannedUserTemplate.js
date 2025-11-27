const unbannedUserTemplate = (userName) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #28a745; text-align: center;">Account Unbanned Successfully</h2>
        <p>Hello ${userName},</p>
        <p>We are pleased to inform you that your account has been reviewed and is now active again.</p>
        <p>You can now log in and access all features as usual.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p style="text-align: center;">
          <a href="https://yourwebsite.com/login" style="background-color: #28a745; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
        </p>
        <p>Best Regards,<br>Health Heaven Team</p>
      </div>
    `;
  };
  
  module.exports = unbannedUserTemplate;
  