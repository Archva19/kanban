const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendVerificationEmail = async (email, code) => {
  try {
    await transporter.sendMail({
      from: `"Kanban Task Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #635FC7; letter-spacing: 4px;">${code}</h1>
          <p>This code will expire soon.</p>
        </div>
      `,
    });
    console.log("Email sent successfully via Brevo SMTP");
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
