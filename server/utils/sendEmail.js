const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendVerificationEmail = async (email, code) => {
  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Email Verification Code",

      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>

          <h1 style="
            color: #635FC7;
            letter-spacing: 4px;
          ">
            ${code}
          </h1>

          <p>This code will expire soon.</p>
        </div>
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

    console.log("Email sent successfully via Brevo:", data);

    return data;
  } catch (error) {
    console.error("Failed to send verification email via Brevo:", error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
