import db from '../models/index.js';
import { authenticateWithAD } from '../services/adAuthentication.service.js';
import { generateJwtToken } from '../services/jwt.service.js';
import { createEmailOtpForUser } from '../services/otp.service.js';
import { sendOtpEmail } from '../services/otp.service.js';
import { createRefreshToken, invalidateRefreshToken,userHasActiveRefreshToken} from '../services/refreshToken.service.js';
import { fetchUserById } from '../services/user.service.js';
import { logAudit } from '../utils/auditLogger.js';

const { User, Otp, AuthenticationType, Role, AccessRight } = db;

const RETURN_OTP_IN_RESPONSE = true;
const OTP_MAX_ATTEMPTS = 5;

/**
 * /auth/login
 * 1) If only email(no password/otp) -> classification (INTERNAL/EXTERNAL)
 * 2) If INTERNAL + password -> AD auth + tokens
 * 3) EXTERNAL -> no OTP here; UI must call /auth/send-otp next
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    // Require email
    if (!email) {
      await logAudit({
        action: 'LOGIN',
        status: 'FAILED',
        reason: 'Email missing',
        failure_code: 'LOGIN_000',
        req,
      });
      return res.status(400).json({ message: 'Email is required' });
    }

    const whereClause = { email, isActive: true, deleted: false };
    const user = await User.findOne({
      where: whereClause,
      include: [
        { model: AuthenticationType, as: 'authType' },
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'roleName', 'roleType'],
        },
        {
          model: AccessRight,
          as: 'accessRights',
          attributes: ['id', 'rightName', 'code'],
        },
      ],
    });

    if (!user) {
      await logAudit({
        email,
        action: 'LOGIN',
        status: 'FAILED',
        reason: 'User not found',
        failure_code: 'LOGIN_001',
        req,
      });

      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isActive) {
      await logAudit({
        user,
        action: 'LOGIN',
        status: 'FAILED',
        reason: 'User inactive',
        failure_code: 'LOGIN_002',
        req,
      });

      return res.status(403).json({ message: 'User inactive' });
    }

    // INTERNAL FLOW
    if (user.userType === 'INTERNAL') {
      // If password not provided -> inform UI to show password box
      if (!password) {
        await logAudit({
          user,
          action: 'LOGIN',
          status: 'SUCCESS',
          reason: 'Internal user identified, password required',
          req,
        });

        return res.status(200).json({
          loginType: 'INTERNAL',
          nextStep: 'PASSWORD_REQUIRED',
          message: 'Internal user detected. Please enter password.',
        });
      }

      // If password provided -> AD authenticate
      const adResponse = await authenticateWithAD(user.email, password);

      await logAudit({
        user,
        action: 'LOGIN',
        status: 'FAILED',
        reason: adResponse.data?.message || 'AD authentication failed',
        failure_code: 'AD_001',
        req,
      });

      if (adResponse.status === 500) {
        return res.status(500).json({
          message: adResponse.data?.message || adResponse.data,
        });
      }

      if (adResponse.status === 401) {
        return res.status(401).json({
          message: adResponse.data?.message || 'Unauthorized',
        });
      }

      
const alreadyActive = await userHasActiveRefreshToken(user.id);
if (alreadyActive) {
  await logAudit({
    user,
    action: 'LOGIN',
    status: 'FAILED',
    reason: 'User already active on another device/browser',
    failure_code: 'LOGIN_ACTIVE_409',
    req,
  });
  return res.status(409).json({
    message: 'You are already logged in on another device or browser. Please logout there first.',
  });
}
      // Success -> issue tokens
      const jwtToken = generateJwtToken({ userId: user.id });
      const refreshTokenObj = await createRefreshToken(user.id);
      await logAudit({
        user,
        action: 'LOGIN',
        status: 'SUCCESS',
        reason: 'Internal login successful (AD)',
        req,
      });
      const userData = await fetchUserById(user.id);
      return res.status(200).json({
        loginType: 'INTERNAL',
        message: 'Login successful',
        token: jwtToken,
        refreshToken: refreshTokenObj.token,
        user: userData,
      });
    }

    // EXTERNAL FLOW
    if (user.userType === 'EXTERNAL') {
      await logAudit({
        user,
        action: 'LOGIN',
        status: 'SUCCESS',
        reason: 'External user identified, OTP required',
        req,
      });

      return res.status(200).json({
        loginType: 'EXTERNAL',
        nextStep: 'OTP_SEND_REQUIRED',
        message: 'External user detected. Please request OTP.',
      });
    }
    await logAudit({
      user,
      action: 'LOGIN',
      status: 'FAILED',
      reason: 'Unknown userType',
      failure_code: 'LOGIN_003',
      req,
    });

    return res.status(400).json({ message: 'Invalid login flow' });
  } catch (error) {
    await logAudit({
      action: 'LOGIN',
      status: 'FAILED',
      reason: error.message,
      failure_code: 'SERVER_500',
      req,
    });

    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * /auth/send-otp
 * Sends OTP for EXTERNAL users via email
 */
export async function sendOtp(req, res) {
  try {
    const { email } = req.body || {};

    if (!email) {
      await logAudit({
        action: 'SEND_OTP',
        status: 'FAILED',
        reason: 'Email missing',
        failure_code: 'OTP_000',
        req,
      });

      return res.status(400).json({ message: 'Email is required' });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const user = await findActiveUser({ email });
      if (!user) {
        await logAudit({
          email,
          action: 'SEND_OTP',
          status: 'FAILED',
          reason: 'User not found',
          failure_code: 'OTP_001',
          req,
        });
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.userType !== 'EXTERNAL') {
        await logAudit({
          user,
          action: 'SEND_OTP',
          status: 'FAILED',
          reason: 'Internal users cannot request OTP',
          failure_code: 'OTP_002',
          req,
        });

        return res.status(400).json({ message: 'Internal users do not use OTP' });
      }
      if (!isAuthType(user, 'OTP')) {
        return res.status(400).json({ message: 'User not configured for Email OTP' });
      }
      const latestLock = await Otp.findOne({
        where: { userId: user.id, otpType: 'EMAIL', locked: true },
        order: [['createdAt', 'DESC']],
      });
      if (latestLock) {
        await logAudit({
          user,
          action: 'SEND_OTP',
          status: 'FAILED',
          reason:
            'Account locked due to too many failed OTP attempts. Please contact RM or try after an hour',
          failure_code: 'OTP_LOCKED',
          req,
        });

        return res.status(423).json({
          message:
            'Account locked due to too many failed OTP attempts. Please contact RM or try after an hour',
          locked: latestLock.locked,
        });
      }

      const { otpCode } = await createEmailOtpForUser(user);
      try {
        await sendOtpEmail(user.email, otpCode);
      } catch (e) {
        console.log('Email send failed:', e.message);
      }
      await logAudit({
        user,
        action: 'SEND_OTP',
        status: 'SUCCESS',
        reason: 'OTP sent successfully',
        req,
      });

      return res.status(200).json({
        message: 'OTP sent to your registered email',
        ...(RETURN_OTP_IN_RESPONSE ? { otp: otpCode } : {}),
      });
    }
  } catch (error) {
    await logAudit({
      action: 'SEND_OTP',
      status: 'FAILED',
      reason: error.message,
      failure_code: 'SERVER_500',
      req,
    });

    console.error('Send OTP Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * /auth/verify-otp
 * Verifies OTP for EXTERNAL users and issues tokens.
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body || {};

    if (!otp) {
      await logAudit({
        action: 'VERIFY_OTP',
        status: 'FAILED',
        reason: 'OTP missing',
        failure_code: 'VERIFY_001',
        req,
      });

      return res.status(400).json({ message: 'OTP is required' });
    }

    let user = null;
    let otpType = null;

    if (email) {
      user = await User.findOne({
        where: { email, isActive: true, deleted: false },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'roleName', 'roleType'],
          },
          {
            model: AccessRight,
            as: 'accessRights',
            attributes: ['id', 'rightName', 'code'],
          },
        ],
      });
      otpType = 'EMAIL';
    } else {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!user) {
      await logAudit({
        email,
        action: 'VERIFY_OTP',
        status: 'FAILED',
        reason: 'User not found',
        failure_code: 'VERIFY_002',
        req,
      });

      return res.status(404).json({ message: 'User not found' });
    }

    if (user.userType !== 'EXTERNAL') {
      await logAudit({
        user,
        action: 'VERIFY_OTP',
        status: 'FAILED',
        reason: 'Internal users do not use OTP',
        failure_code: 'VERIFY_003',
        req,
      });

      return res.status(400).json({ message: 'Internal users do not use OTP' });
    }

    // Get latest non-used OTP
    const otpRecord = await Otp.findOne({
      where: {
        userId: user.id,
        otpType,
        isUsed: false,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      await logAudit({
        user,
        action: 'VERIFY_OTP',
        status: 'FAILED',
        reason: 'No OTP found',
        failure_code: 'VERIFY_004',
        req,
      });

      return res.status(400).json({ message: 'No active OTP found' });
    }

    // Expiry check
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Match check
    let otpWarningMessage = 'Invalid OTP';

    if (otpRecord.otpCode !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      // 4th attempt warning
      if (otpRecord.attempts === OTP_MAX_ATTEMPTS - 1) {
        otpWarningMessage =
          'Warning: You have 1 attempt left. If you attempt one more time, your account will be locked for 1 hour.';
      }

      // Lock on max attempts
      if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
        otpRecord.isUsed = true;
        otpRecord.locked = true;
        otpRecord.lockedUntil = new Date(Date.now() + 60 * 60 * 1000);
        await otpRecord.save();

        otpWarningMessage =
          'Your account is now locked due to multiple failed attempts. Please contact your Relationship Manager (RM) for assistance.';
      }

      await logAudit({
        user,
        action: 'VERIFY_OTP',
        status: 'FAILED',
        reason: 'Invalid OTP',
        failure_code: 'VERIFY_005',
        req,
      });

      return res.status(400).json({
        message: otpWarningMessage,
        attempts: otpRecord.attempts,
      });
    }

    // -------------------------------
    // ✅ SUCCESS: Increment login count
    // -------------------------------
    // if (user.firstLogin === null) {
    //   user.firstLogin = true;
    // } else {
    //   user.firstLogin = false;
    // }
    // await user.save();

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    
// After OTP verified successfully:
const alreadyActive = await userHasActiveRefreshToken(user.id);
if (alreadyActive) {
  await logAudit({
    user,
    action: 'VERIFY_OTP',
    status: 'FAILED',
    reason: 'User already active on another device/browser',
    failure_code: 'OTP_ACTIVE_409',
    req,
  });
  return res.status(409).json({
    message: 'You are already logged in on another device or browser. Please logout there first.',
  });
}

    // Issue tokens
    const jwtToken = generateJwtToken({ userId: user.id });
    const refreshTokenObj = await createRefreshToken(user.id);
    const userData = await fetchUserById(user.id);

    await logAudit({
      user,
      action: 'VERIFY_OTP',
      status: 'SUCCESS',
      reason: 'OTP verified successfully',
      req,
    });

    return res.status(200).json({
      message: 'OTP verified successfully',
      token: jwtToken,
      refreshToken: refreshTokenObj.token,
      user: userData,
      policyAccepted: user.policyAccepted,
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


async function findActiveUser(where) {
  const user = await User.findOne({
    where,
    include: [
      { model: AuthenticationType, as: 'authType' },
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'roleName', 'roleType'],
      },
      {
        model: AccessRight,
        as: 'accessRights',
        attributes: ['id', 'rightName', 'code'],
      },
    ],
  });
  if (!user) {
    return null;
  }
  if (!user.isActive) {
    return null;
  }
  return user;
}

function isAuthType(user, typeName) {
  return user?.authType?.name?.toLowerCase() === typeName.toLowerCase();
}
