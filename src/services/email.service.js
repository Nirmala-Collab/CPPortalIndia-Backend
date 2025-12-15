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
 await transporter.sendMail(mailOptions);
}