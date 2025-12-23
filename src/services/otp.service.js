// src/services/otp.service.js
import { generateNumericOtp } from "../utils/otp.js";
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