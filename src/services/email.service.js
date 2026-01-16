// src/services/email.service.js
import transporter from "../config/mailer.js";
export async function sendEmail({ to, cc = [], subject, html }) {
  try {
    // Send the email and await response to check for success
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to,
      cc,
      subject,
      html
    });
    console.log("Email sent: ", info.response);
    return info; // You can log or return the response info for debugging
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw new Error(`Email send failed: ${error.message}`);
  }
}
