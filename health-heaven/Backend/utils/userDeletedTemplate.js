const userDeletedTemplate = (fullName) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
    <h2 style="color: #dc3545;">Account Deleted</h2>
    <p>Dear <strong>${fullName}</strong>,</p>
    <p>Your account has been <strong>permanently deleted</strong> from our system. If you have any questions, please contact support.</p>
    <p>Best regards,<br>Admin Team</p>
  </div>
`;

module.exports = userDeletedTemplate;
