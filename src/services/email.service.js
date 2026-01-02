// src/services/email.service.js
import transporter from "../config/mailer.js";
export async function sendOtpEmail(toEmail, otpCode) {
  const fromAddress = `${process.env.SMTP_USER}@emailcloud.smartping.io`;
  const mailOptions = {
    from: `"CP Portal" <${fromAddress}>`,
    to: toEmail,
    subject: "Your CP Portal Login OTP",
    text: `Your OTP is ${otpCode}. Valid for 2 minutes.`,
    html: `
<p>Hello,</p>
<p>Your OTP for <strong>CP Portal</strong> login is:</p>
<h2>${otpCode}</h2>
<p>This OTP is valid for <strong>2 minutes</strong>.</p>
   `,
  };
  try {
    // Send the email and await response to check for success
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info; // You can log or return the response info for debugging
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw new Error(`Email send failed: ${error.message}`);
  }
}
