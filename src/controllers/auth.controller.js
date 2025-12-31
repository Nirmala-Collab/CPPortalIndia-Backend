
// src/controllers/auth.controller.js
import db from "../models/index.js";
import { generateJwtToken } from "../services/jwt.service.js";
import { createRefreshToken, invalidateRefreshToken } from "../services/refreshToken.service.js";
import { createEmailOtpForUser, createPhoneOtpForUser } from "../services/otp.service.js";
import { sendOtpEmail } from "../services/email.service.js";
// import { authenticateWithAD } from "../services/ldap.service.js"; // plug your AD adapter
import { logAudit } from "../utils/auditLogger.js";
const { User, Otp, AuthenticationType } = db;

// --- Config toggles ---
const RETURN_OTP_IN_RESPONSE = true; // true only for local dev
const OTP_MAX_ATTEMPTS = 5;

/**
 * /auth/login
 * 1) If only email/phone (no password/otp) -> classification (INTERNAL/EXTERNAL)
 * 2) If INTERNAL + password -> AD auth + tokens
 * 3) EXTERNAL -> no OTP here; UI must call /auth/send-otp next
 */
export async function login(req, res) {
  try {
    const { email, phone, password, otp } = req.body || {};

    // Require at least email or phone
    if (!email && !phone) {
      await logAudit({ action: "LOGIN", status: "FAILED", reason: "Email or phone missing", failure_code: "LOGIN_000", req });
      return res.status(400).json({ message: "Email or Phone is required" });
    }

    const whereClause = email ? { email } : { phone };
    const user = await User.findOne({
      where: whereClause,
      include: [{ model: AuthenticationType, as: "authType" }],
    });

    if (!user)
      {
             await logAudit({ email, phone, action: "LOGIN", status: "FAILED", reason: "User not found", failure_code: "LOGIN_001", req });

        return res.status(404).json({ message: "User not found" });
  }
    if (!user.isActive)
      { 
             await logAudit({ user, action: "LOGIN", status: "FAILED", reason: "User inactive", failure_code: "LOGIN_002", req });

        return res.status(403).json({ message: "User inactive" });
  }

    // INTERNAL FLOW
    if (user.userType === "INTERNAL") {
      // If password not provided -> inform UI to show password box
      if (!password) {
               await logAudit({ user, action: "LOGIN", status: "SUCCESS", reason: "Internal user identified, password required", req });

        return res.status(200).json({
          loginType: "INTERNAL",
          nextStep: "PASSWORD_REQUIRED",
          message: "Internal user detected. Please enter password.",
        });
      }

      // If password provided -> AD authenticate
      try {
        // await authenticateWithAD(user.email, password);
      } catch (err) {
               await logAudit({ user, action: "LOGIN", status: "FAILED", reason: "Invalid AD password", failure_code: "AD_001", req });

        return res.status(401).json({ message: "Invalid Active Directory credentials" });
      }

      // Success -> issue tokens
      const jwtToken = generateJwtToken({ userId: user.id });
      const refreshTokenObj = await createRefreshToken(user.id);
     await logAudit({ user, action: "LOGIN", status: "SUCCESS", reason: "Internal login successful (AD)", req });

      return res.status(200).json({
        loginType: "INTERNAL",
        message: "Login successful",
        token: jwtToken,
        refreshToken: refreshTokenObj.token,
        user: publicUser(user),
      });
    }

    // EXTERNAL FLOW
    if (user.userType === "EXTERNAL") {
      // Never send OTP here. Only tell UI what to do next.
           await logAudit({ user, action: "LOGIN", status: "SUCCESS", reason: "External user identified, OTP required", req });

      return res.status(200).json({
        loginType: "EXTERNAL",
        nextStep: "OTP_SEND_REQUIRED",
        message: "External user detected. Please request OTP.",
      });
    }
   await logAudit({ user, action: "LOGIN", status: "FAILED", reason: "Unknown userType", failure_code: "LOGIN_003", req });

    return res.status(400).json({ message: "Invalid login flow" });
  } catch (error) {
       await logAudit({ action: "LOGIN", status: "FAILED", reason: err.message, failure_code: "SERVER_500", req });

    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * /auth/send-otp
 * Sends OTP for EXTERNAL users via email or phone based on input.
 */
export async function sendOtp(req, res) {
  try {
    const { email, phone } = req.body || {};

    if (!email && !phone) {
           await logAudit({ action: "SEND_OTP", status: "FAILED", reason: "Email or phone missing", failure_code: "OTP_000", req });

      return res.status(400).json({ message: "Email or Phone is required" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const user = await findActiveUser({ email });
      if (!user)
   {          await logAudit({ email, phone, action: "SEND_OTP", status: "FAILED", reason: "User not found", failure_code: "OTP_001", req });
 return res.status(404).json({ message: "User not found" });}

      if (user.userType !== "EXTERNAL") {
             await logAudit({ user, action: "SEND_OTP", status: "FAILED", reason: "Internal users cannot request OTP", failure_code: "OTP_002", req });

        return res.status(400).json({ message: "Internal users do not use OTP" });
      }
      if (!isAuthType(user, "email")) {
        return res.status(400).json({ message: "User not configured for Email OTP" });
      }

      const { otpCode } = await createEmailOtpForUser(user);
      try {
        await sendOtpEmail(user.email, otpCode);
      } catch (e) {

        console.log("Email send failed:", e.message);
      }
   await logAudit({ user, action: "SEND_OTP", status: "SUCCESS", reason: "OTP sent successfully", req });

      return res.status(200).json({
        message: "OTP sent",
        ...(RETURN_OTP_IN_RESPONSE ? { otp: otpCode } : {}),
      });
    }

  } catch (error) {
               await logAudit({ action: "SEND_OTP", status: "FAILED", reason: err.message, failure_code: "SERVER_500", req });

    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * /auth/verify-otp
 * Verifies OTP for EXTERNAL users and issues tokens.
 */
export async function verifyOtp(req, res) {
  try {
    const { email, phone, otp } = req.body || {};
    if (!otp) {
           await logAudit({ action: "VERIFY_OTP", status: "FAILED", reason: "OTP missing", failure_code: "VERIFY_001", req });

           return res.status(400).json({ message: "OTP is required" });}

    let user = null;
    let otpType = null;

    if (email) {
      user = await User.findOne({ where: { email } });
      otpType = "EMAIL";
    } else if (phone) {
      user = await User.findOne({ where: { phone } });
      otpType = "PHONE";
    } else {
      return res.status(400).json({ message: "Email or Phone is required" });
    }

    if (!user) {
           await logAudit({ email, phone, action: "VERIFY_OTP", status: "FAILED", reason: "User not found", failure_code: "VERIFY_002", req });

           return res.status(404).json({ message: "User not found" });}
    if (user.userType !== "EXTERNAL") {
           await logAudit({ user, action: "VERIFY_OTP", status: "FAILED", reason: "Internal users do not use OTP", failure_code: "VERIFY_003", req });

      return res.status(400).json({ message: "Internal users do not use OTP" });
    }

    // Get latest non-used OTP
    const otpRecord = await Otp.findOne({
     where: {
       userId: user.id,
       otpType,
       isUsed: false,
     },
     order: [["createdAt", "DESC"]],
   });
    if (!otpRecord) {
           await logAudit({ user, action: "VERIFY_OTP", status: "FAILED", reason: "No OTP found", failure_code: "VERIFY_004", req });

           return res.status(400).json({ message: "No active OTP found" });}

    // Expiry check
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Match check
  let otpWarningMessage = "";
   // ----------------------------------------------
   if (otpRecord.otpCode !== otp) {
     otpRecord.attempts += 1;
     await otpRecord.save();
     console.log("Updated attempts:", otpRecord.attempts);
     // 4th attempt
     if (otpRecord.attempts === OTP_MAX_ATTEMPTS - 1) {
    otpWarningMessage = 'Warning: You have 1 attempt left. If you attempt one more time, your account will be locked for 1 hour.';
  }
//5th attempt
   if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
       otpRecord.isUsed = true;
       await otpRecord.save();
    otpWarningMessage = 'Your account is now locked due to multiple failed attempts. Please contact your Relationship Manager (RM) for assistance.';
  }

  await logAudit({ user, action: "VERIFY_OTP", status: "FAILED", reason: "Invalid OTP", failure_code: "VERIFY_005", req });

  return res.status(400).json({
       message: "Invalid OTP",
       warning: otpWarningMessage,
       attempts: otpRecord.attempts,
     });
}

    // Issue tokens
    const jwtToken = generateJwtToken({ userId: user.id });
    const refreshTokenObj = await createRefreshToken(user.id);
   await logAudit({ user, action: "VERIFY_OTP", status: "SUCCESS", reason: "OTP verified successfully", req });

    return res.status(200).json({
      message: "OTP verified successfully",
      token: jwtToken,
      refreshToken: refreshTokenObj.token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * /auth/logout
 */
export async function logout(req, res) {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
           await logAudit({ action: "LOGOUT", status: "FAILED", reason: "Refresh token missing", failure_code: "LOGOUT_001", req });

      return res.status(400).json({ message: "Refresh token is required" });
    }
    await invalidateRefreshToken(refreshToken);
       await logAudit({ action: "LOGOUT", status: "SUCCESS", reason: "Logout successful", req });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
       await logAudit({ action: "LOGOUT", status: "FAILED", reason: err.message, failure_code: "SERVER_500", req });

    return res.status(500).json({ message: "Internal server error" });
  }
}

// ---------------- Helpers ----------------
function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

async function findActiveUser(where) {
  const user = await User.findOne({
    where,
    include: [{ model: AuthenticationType, as: "authType" }],
  });
  if (!user) return null;
  if (!user.isActive) return null;
  return user;
}

function isAuthType(user, typeName) {
  return user?.authType?.name?.toLowerCase() === typeName.toLowerCase();
}
