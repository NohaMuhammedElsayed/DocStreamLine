// server/configs/nodeMailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Brevo uses STARTTLS, not SSL
  auth: {
    user: process.env.SMTP_USER,      // Your Brevo SMTP login
    pass: process.env.SMTP_PASSWORD,  // Your Brevo SMTP key
  },
});

/**
 * Send an email via Brevo SMTP relay
 * @param {Object} param0
 * @param {string} param0.to - Recipient email address
 * @param {string} param0.subject - Email subject line
 * @param {string} param0.body - HTML content of the email
 */
export const sendEmail = async ({ to, subject, body }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL || process.env.SMTP_USER, // fallback
      to,
      subject,
      html: body,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed: " + error.message);
  }
};

export default sendEmail;
