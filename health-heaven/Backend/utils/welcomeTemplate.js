const welcomeEmail = (fullName) => {
    return {
      text: `Hello ${fullName},\n\nWelcome to our platform! We're thrilled to have you here. If you need any assistance, feel free to reach out.\n\nBest Regards,\nYour Team`, // Use backticks here
      htmlContent: `
        <table width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600px" cellspacing="0" cellpadding="0" style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 5px rgba(0,0,0,0.1);">
                <tr>
                  <td align="center">
                    <h2 style="color: #007bff; margin-bottom: 10px;">Welcome, ${fullName}!</h2>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; text-align: left;">
                    <p style="margin: 0;">We’re excited to have you join us. Our platform is designed to provide you with the best experience.</p>
                    <p style="margin: 0;">If you ever need any help, don't hesitate to contact us.</p>
                    <p style="margin-top: 20px; font-weight: bold;">Best Regards,</p>
                    <p><strong>Your Team</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    };
  };
  
  module.exports = welcomeEmail;
  