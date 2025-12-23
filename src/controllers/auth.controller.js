// src/controllers/auth.controller.js
import db from "../models/index.js";
import {
 createEmailOtpForUser,
 createPhoneOtpForUser
} from "../services/otp.service.js";
import { sendOtpEmail } from "../services/email.service.js";
import { generateJwtToken } from "../services/jwt.service.js";
import { createRefreshToken, invalidateRefreshToken } from "../services/refreshToken.service.js";
// import { authenticateWithAD } from "../services/ldap.service.js";
const { User, Otp, AuthenticationType } = db;


export async function login(req, res) {
 try {
   const { email, phone, password } = req.body;
   if (!email && !phone) {
     return res.status(400).json({ message: "Email or Phone is required" });
   }
   // ------------------------------------------------
   // 1. FIND USER
   // ------------------------------------------------
   const whereClause = email ? { email } : { phone };
   const user = await User.findOne({
     where: whereClause,
     include: [{ model: AuthenticationType, as: "authType" }],
   });
   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }
   if (!user.isActive) {
     return res.status(403).json({ message: "User inactive" });
   }
   // ------------------------------------------------
   // 2. INTERNAL USER FLOW (2-step)
   // ------------------------------------------------
   if (user.userType === "INTERNAL") {
     // STEP 1: No password yet → tell frontend to ask password
     if (!password) {
       return res.status(200).json({
         loginType: "INTERNAL",
         nextStep: "PASSWORD_REQUIRED",
         message: "Internal user detected. Please enter password.",
       });
     }
     // STEP 2: Password provided → authenticate with AD
     try {
       await authenticateWithAD(user.email, password);
     } catch (err) {
       return res.status(401).json({
         message: "Invalid Active Directory credentials",
       });
     }
     // AD success → issue tokens
     const jwtToken = generateJwtToken({ userId: user.id });
     const refreshTokenObj = await createRefreshToken(user.id);
     return res.status(200).json({
       loginType: "INTERNAL",
       message: "Login successful",
       token: jwtToken,
       refreshToken: refreshTokenObj.token,
       user: {
         id: user.id,
         email: user.email,
         firstName: user.firstName,
         lastName: user.lastName,
       },
     });
   }
   // ------------------------------------------------
   // 3. EXTERNAL USER FLOW (OTP)
   // ------------------------------------------------
   if (user.userType === "EXTERNAL") {
     if (email) {
       req.body = { email };
       return sendOtp(req, res);
     }
     if (phone) {
       req.body = { phone };
       return sendOtp(req, res);
     }
   }
   return res.status(400).json({ message: "Invalid login flow" });
 } catch (error) {
   console.error("Login Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}

// ----------------------------------------------------
// 1. UNIFIED SEND OTP (Email OR Phone)
// ----------------------------------------------------
export async function sendOtp(req, res) {
 try {
   const { email, phone } = req.body;
   if (!email && !phone) {
     return res.status(400).json({ message: "Email or Phone is required" });
   }
   // -------------------- EMAIL LOGIN --------------------
   if (email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
       return res.status(400).json({ message: "Invalid email format" });
     }
     const user = await User.findOne({
       where: { email },
       include: [{ model: AuthenticationType, as: "authType" }],
     });
     if (!user) return res.status(404).json({ message: "User not found" });
     if (!user.isActive) return res.status(403).json({ message: "User inactive" });
     if (user.authType?.name !== "email") {
       return res.status(400).json({ message: "User not configured for Email OTP" });
     }
     const { otpCode } = await createEmailOtpForUser(user);
     // email send (pending fix)
     try {
       await sendOtpEmail(user.email, otpCode);
     } catch (e) {
       console.log("Email send failed temporarily:", e.message);
     }
     return res.status(200).json({
       message: "Email OTP sent",
       otp: otpCode, // remove after SMTP fixed
     });
   }
   // -------------------- PHONE LOGIN --------------------
   if (phone) {
     if (!/^\d{10}$/.test(phone)) {
       return res.status(400).json({ message: "Invalid phone number" });
     }
     const user = await User.findOne({
       where: { phone },
       include: [{ model: AuthenticationType, as: "authType" }],
     });
     if (!user) return res.status(404).json({ message: "User not found" });
     if (!user.isActive) return res.status(403).json({ message: "User inactive" });
     if (user.authType?.name !== "phone") {
       return res.status(400).json({ message: "User not configured for Phone OTP" });
     }
     const { otpCode } = await createPhoneOtpForUser(user);
     return res.status(200).json({
       message: "Phone OTP sent",
       otp: otpCode, // remove once SMS gateway is added
     });
   }
 } catch (error) {
   console.error("Send OTP Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}

// ----------------------------------------------------
// 2. UNIFIED VERIFY OTP (Email OR Phone)
// ----------------------------------------------------
export async function verifyOtp(req, res) {
 try {
   const { email, phone, otp } = req.body;
   if (!otp) return res.status(400).json({ message: "OTP is required" });
   let user = null;
   let otpType = null;
   // EMAIL FLOW
   if (email) {
     user = await User.findOne({ where: { email } });
     otpType = "EMAIL";
   }
   // PHONE FLOW
   if (phone) {
     user = await User.findOne({ where: { phone } });
     otpType = "PHONE";
   }
   if (!user) return res.status(404).json({ message: "User not found" });
   const otpRecord = await Otp.findOne({
     where: {
       userId: user.id,
       otpType,
       isUsed: false,
     },
     order: [["created_at", "DESC"]],
   });
   if (!otpRecord) return res.status(400).json({ message: "No active OTP found" });
   if (otpRecord.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });
   if (new Date() > otpRecord.expiresAt) return res.status(400).json({ message: "OTP expired" });
   otpRecord.isUsed = true;
   await otpRecord.save();
   const jwtToken = generateJwtToken({ userId: user.id });
   const refreshTokenObj = await createRefreshToken(user.id);
   return res.status(200).json({
     message: "OTP verified successfully",
     token: jwtToken,
     refreshToken: refreshTokenObj.token,
     user: {
       id: user.id,
       email: user.email,
       phone: user.phone,
       firstName: user.firstName,
       lastName: user.lastName,
     },
   });
 } catch (error) {
   console.error("Verify OTP Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}

// LOGOUT
// ----------------------------------------------------
export async function logout(req, res) {
 try {
   const { refreshToken } = req.body;
   if (!refreshToken) {
     return res.status(400).json({ message: "Refresh token is required" });
   }
   await invalidateRefreshToken(refreshToken);
   return res.status(200).json({
     message: "Logged out successfully",
   });
 } catch (error) {
   console.error("Logout Error:", error);
   return res.status(500).json({ message: "Internal server error" });
 }
}

