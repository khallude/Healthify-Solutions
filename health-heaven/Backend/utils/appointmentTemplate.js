const appointmentTemplate = (fullName, doctorName, date, time) => {
    return {
      doctor: {
        subject: "New Appointment Request",
        text: `You have a new appointment request from ${fullName} on ${date} at ${time}.`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #0056b3;">New Appointment Request</h2>
            <p><strong>Patient:</strong> ${fullName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Please log in to approve or decline the request.</p>
          </div>
        `,
      },
      user: {
        subject: "Appointment Confirmation - Pending Approval",
        text: `Your appointment with Dr. ${doctorName} on ${date} at ${time} is pending approval.`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #0056b3;">Appointment Request Sent</h2>
            <p>Your appointment with <strong>Dr. ${doctorName}</strong> is awaiting approval.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>We will notify you once it is confirmed.</p>
          </div>
        `,
      },
      admin: {
        subject: "New Appointment Alert",
        text: `A new appointment has been booked by ${fullName} with Dr. ${doctorName} on ${date} at ${time}.`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="color: #0056b3;">New Appointment Alert</h2>
            <p><strong>Patient:</strong> ${fullName}</p>
            <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p>Please review the appointment details in the admin panel.</p>
          </div>
        `,
      },
    };
  };
  
  module.exports = appointmentTemplate;
  