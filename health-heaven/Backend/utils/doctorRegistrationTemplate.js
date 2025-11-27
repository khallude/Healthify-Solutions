const doctorRegistrationTemplate = (fullName) => ({
    subject: "Doctor Registration Successful - Pending Approval",
    text: `Dear Dr. ${fullName}, your registration has been received and is pending approval.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #007bff; text-align: center;">Welcome, Dr. ${fullName}!</h2>
        <p style="font-size: 16px; color: #333;">Your account has been successfully registered and is currently under review by our admin team.</p>
        <p style="font-size: 16px; color: #333;">We will notify you once your account is approved.</p>
        <p style="font-size: 16px; color: #333;">Thank you for joining us!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="#" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">Visit Dashboard</a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">Need help? Contact us at <a href="mailto:support@example.com">support@example.com</a></p>
      </div>
    `,
  });
  
  const adminAlertTemplate = (fullName) => ({
    subject: "New Doctor Registration Alert",
    text: `A new doctor, Dr. ${fullName}, has registered. Please review their application.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff;">
        <h2 style="color: #dc3545; text-align: center;">New Doctor Registration</h2>
        <p style="font-size: 16px; color: #333;">Dear Admin,</p>
        <p style="font-size: 16px; color: #333;">A new doctor, <strong>Dr. ${fullName}</strong>, has registered on the platform.</p>
        <p style="font-size: 16px; color: #333;">Please review their details and approve their account if they meet the necessary requirements.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="#" style="padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">Review Registration</a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center; margin-top: 20px;">Need assistance? Contact support at <a href="mailto:admin@example.com">admin@example.com</a></p>
      </div>
    `,
  });
  
  module.exports = { doctorRegistrationTemplate, adminAlertTemplate };
  