import db from '../models/index.js';
import { generateNumericOtp } from '../utils/otp.js';
import { sendEmail } from './email.service.js';
import { authentication, uploadDocClient } from '../utils/mailContent.js';

const { Otp } = db;
const OTP_EXPIRY_MINUTES = 2;

export async function createEmailOtpForUser(user) {
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
    to: 'venkata.korumilli@tcs.com',
    subject: authentication.subject,
    html: authentication.body(otpCode),
  });
}
