// src/config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: Number(process.env.SMTP_PORT),
 secure: false,
 auth: {
   user: process.env.SMTP_USER,
   pass: process.env.SMTP_PASS,
 },
});
transporter.verify((err) => {
 if (err) {
   console.error("❌ SMTP Error:", err);
 } else {
   console.log("✅ SMTP server ready");
 }
});
export default transporter;