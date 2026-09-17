const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Reset Your Password - Kanban App",

      htmlContent: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link is valid for 10 minutes:</p>
      <a href="${resetUrl}" style="background-color: #635FC7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
      `,

      sender: {
        name: "Kanban Task Manager",
        email: process.env.EMAIL_USER,
      },

      to: [
        {
          email: email,
        },
      ],
    });

    console.log("Email sent successfully via Brevo");

    return data;
  } catch (error) {
    console.error("Failed to send verification email via Brevo:", error);
    throw error;
  }
};

module.exports = sendResetPasswordEmail;
