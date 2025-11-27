module.exports = (fullName, message) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #007bff;">Hello ${fullName},</h2>
    <p>You have a new reminder:</p>
    <blockquote style="font-size: 16px; color: #555; background: #f9f9f9; padding: 10px; border-left: 4px solid #007bff;">
      ${message}
    </blockquote>
    <p style="font-size: 14px; color: #777;">Please take the necessary action.</p>
    <p style="font-size: 14px; text-align: center; color: #999;">&copy; ${new Date().getFullYear()} Healthify Solutions</p>
  </div>
`;
