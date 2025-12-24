
// src/controllers/auth.controller.js
import db from "../models/index.js";
import { generateJwtToken } from "../services/jwt.service.js";
import { createRefreshToken, invalidateRefreshToken } from "../services/refreshToken.service.js";
import { createEmailOtpForUser, createPhoneOtpForUser } from "../services/otp.service.js";
import { sendOtpEmail } from "../services/email.service.js";
// import { authenticateWithAD } from "../services/ldap.service.js"; // plug your AD adapter

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
      return res.status(400).json({ message: "Email or Phone is required" });
    }

    const whereClause = email ? { email } : { phone };
    const user = await User.findOne({
      where: whereClause,
      include: [{ model: AuthenticationType, as: "authType" }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isActive) return res.status(403).json({ message: "User inactive" });

    // INTERNAL FLOW
    if (user.userType === "INTERNAL") {
      // If password not provided -> inform UI to show password box
      if (!password) {
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
        return res.status(401).json({ message: "Invalid Active Directory credentials" });
      }

      // Success -> issue tokens
      const jwtToken = generateJwtToken({ userId: user.id });
      const refreshTokenObj = await createRefreshToken(user.id);

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
      return res.status(200).json({
        loginType: "EXTERNAL",
        nextStep: "OTP_SEND_REQUIRED",
        message: "External user detected. Please request OTP.",
      });
    }

    return res.status(400).json({ message: "Invalid login flow" });
  } catch (error) {
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
      return res.status(400).json({ message: "Email or Phone is required" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const user = await findActiveUser({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.userType !== "EXTERNAL") {
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

      return res.status(200).json({
        message: "OTP sent",
       otp:otpCode
      });
    }

    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }

      const user = await findActiveUser({ phone });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.userType !== "EXTERNAL") {
        return res.status(400).json({ message: "Internal users do not use OTP" });
      }
      if (!isAuthType(user, "phone")) {
        return res.status(400).json({ message: "User not configured for Phone OTP" });
      }

      const { otpCode } = await createPhoneOtpForUser(user);
      // TODO: integrate SMS gateway send here

      return res.status(200).json({
        message: "OTP sent",
        ...(RETURN_OTP_IN_RESPONSE ? { otp: otpCode } : {}),
      });
    }
  } catch (error) {
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
    if (!otp) return res.status(400).json({ message: "OTP is required" });

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

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.userType !== "EXTERNAL") {
      return res.status(400).json({ message: "Internal users do not use OTP" });
    }

    // Get latest non-used OTP
    const otpRecord = await Otp.findOne({
      where: { userId: user.id, otpType, isUsed: false },
      order: [["createdAt", "DESC"]], // ensure your model uses camelCase
    });

    if (!otpRecord) return res.status(400).json({ message: "No active OTP found" });

    // Expiry check
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Match check
    if (otpRecord.otpCode !== otp) {
      // Optional: track attempts to throttle brute force
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      await otpRecord.save();
      if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
        otpRecord.isUsed = true; // lock this OTP
        await otpRecord.save();
      }
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Issue tokens
    const jwtToken = generateJwtToken({ userId: user.id });
    const refreshTokenObj = await createRefreshToken(user.id);

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
      return res.status(400).json({ message: "Refresh token is required" });
    }
    await invalidateRefreshToken(refreshToken);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
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
