// src/services/otp.service.js
import { generateNumericOtp } from "../utils/otp.js";
import { sendEmail } from "./email.service.js";

import db from "../models/index.js";
const { Otp } = db;
const OTP_EXPIRY_MINUTES = 2;
// For EMAIL OTP
export async function createEmailOtpForUser(user) {
  const otpCode = generateNumericOtp(5);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  // Invalidate previous unused EMAIL OTPs
  await Otp.update(
    { isUsed: true },
    {
      where: {
        userId: user.id,
        otpType: "EMAIL",
        isUsed: false,
      },
    }
  );
  const otpRecord = await Otp.create({
    userId: user.id,
    otpCode,
    otpType: "EMAIL",
    expiresAt,
    isUsed: false,
  });
  return { otpCode, otpRecord };
}
// For PHONE OTP
export async function createPhoneOtpForUser(user) {
  const otpCode = generateNumericOtp(5);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  // Invalidate previous unused PHONE OTPs
  await Otp.update(
    { isUsed: true },
    {
      where: {
        userId: user.id,
        otpType: "PHONE",
        isUsed: false,
      },
    }
  );
  const otpRecord = await Otp.create({
    userId: user.id,
    otpCode,
    otpType: "PHONE",
    expiresAt,
    isUsed: false,
  });
  return { otpCode, otpRecord };
}

export async function sendOtpEmail(toEmail, otpCode) {
  return sendEmail({
    to: toEmail,
    subject: "Your CP Portal Login OTP",
    text: `Your OTP is ${otpCode}. Valid for 2 minutes.`,
    html: `
<p>Hello,</p>
<p>Your OTP for <strong>CP Portal</strong> login is:</p>
<h2>${otpCode}</h2>
<p>This OTP is valid for <strong>2 minutes</strong>.</p>
   `
  });
}