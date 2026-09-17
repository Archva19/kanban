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

    console.log("Email sent successfully via Brevo");

    return data;
  } catch (error) {
    console.error("Failed to send verification email via Brevo:", error);
    throw error;
  }
};

const sendAlreadyRegisteredEmail = async (email) => {
  try {
    const data = await brevo.transactionalEmails.sendTransacEmail({
      subject: "Registration Attempt - Account Already Exists",

      htmlContent: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Registration Attempt Notice</h2>
        <p>You (or someone else) entered this email to create a new account.</p>
        <p>Your account is already active! You don't need to register again.</p>
        <p><a href="${process.env.CLIENT_URL}/sign-in">Click here to Sign In</a></p>
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

    console.log("Email sent successfully via Brevo");

    return data;
  } catch (error) {
    console.error("Failed to send verification email via Brevo:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendAlreadyRegisteredEmail,
};
