import db from '../models/index.js';
import { authentication, uploadDocClient } from '../utils/mailContent.js';
import { generateNumericOtp } from '../utils/otp.js';

import { sendEmail } from './email.service.js';

const { Otp } = db;
const OTP_EXPIRY_MINUTES = 2;
const OTP_RESEND_COOLDOWN_MS = 60_000; // 60 seconds

export async function createEmailOtpForUser(user) {
  // --- Cooldown check: block another OTP within 60 seconds ---
  const latest = await Otp.findOne({
    where: { userId: user.iAd, otpType: 'EMAIL' },
    order: [['createdAt', 'DESC']],
  });
  if (latest) {
    const ageMs = Date.now() - new Date(latest.createdAt).getTime();
    if (ageMs < OTP_RESEND_COOLDOWN_MS) {
      const left = Math.ceil((OTP_RESEND_COOLDOWN_MS - ageMs) / 1000);
      const err = new Error(`OTP recently sent. Please retry after ${left}s.`);
      err.status = 429; // Too Many Requests
      throw err;
    }
  }

  const otpCode = generateNumericOtp(5);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  await Otp.update(
    { isUsed: true },
    {
      where: {
        userId: user.id,
        otpType: 'EMAIL',
        isUsed: false,
      },
    }
  );
  const otpRecord = await Otp.create({
    userId: user.id,
    otpCode,
    otpType: 'EMAIL',
    expiresAt,
    isUsed: false,
  });
  return { otpCode, otpRecord };
}


export async function sendOtpEmail(toEmail, otpCode) {
  return sendEmail({
    to: toEmail,
    subject: authentication.subject,
    html: authentication.body(otpCode),
  });
}
