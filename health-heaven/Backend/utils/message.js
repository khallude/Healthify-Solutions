// messages.js - Email Message Templates

exports.newUserSignupMessage = (user) => ({
  to: process.env.EMAIL_USER, // Recipient (Admin/System)
  subject: "New User Registration Notification",
  text: `A new user has registered on the system.
  
    User Details:
    Name: ${user.fullName}
    Email: ${user.email}
    Phone: ${user.phone || "Not provided"}
    Age: ${user.age || "Not provided"}
    Blood Type: ${user.bloodType || "Not provided"}
    Address: ${user.address || "Not provided"}
    Allergies: ${user.allergies || "Not provided"}
    Chronic Conditions: ${user.chronicConditions || "Not provided"}
    
    Regards,
    Climate Care Initiative`,
  htmlContent: `
      <h2>New User Signed Up</h2>
      <p>A new user has registered on the system.</p>
      <hr />
      <h3>User Details:</h3>
      <p><strong>Name:</strong> ${user.fullName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone || "Not provided"}</p>
      <p><strong>Age:</strong> ${user.age || "Not provided"}</p>
      <p><strong>Blood Type:</strong> ${user.bloodType || "Not provided"}</p>
      <p><strong>Address:</strong> ${user.address || "Not provided"}</p>
      <p><strong>Allergies:</strong> ${user.allergies || "Not provided"}</p>
      <p><strong>Chronic Conditions:</strong> ${
        user.chronicConditions || "Not provided"
      }</p>
      <br />
      <p>Regards,</p>
      <p>Climate Care Initiative</p>
    `,
});
