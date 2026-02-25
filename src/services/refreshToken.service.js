// services/refreshToken.service.js
import crypto from 'crypto';
import db from '../models/index.js';
const { RefreshToken } = db;
import { Op } from 'sequelize';
const REFRESH_EXPIRY_DAYS = 30;

// export async function userHasActiveRefreshToken(userId) {
//   const now = new Date();
//   const existing = await RefreshToken.findOne({
//     where: {
//       userId,
//       expiresAt: { [Op.gt]: now },
//     },
//   });
//   return !!existing;
// }

export async function createRefreshToken(userId) {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const refreshToken = await RefreshToken.create({
    userId,
    token,
    expiresAt,
  });
  return refreshToken;
}

export async function verifyRefreshToken(token) {
  const tokenRecord = await RefreshToken.findOne({ where: { token } });
  if (!tokenRecord) return null;
  if (new Date() > tokenRecord.expiresAt) return null;
  return tokenRecord;
}

export async function invalidateRefreshToken(token) {
  await RefreshToken.destroy({ where: { token } });
}

export async function invalidateAllUserRefreshTokens(userId) {
  await RefreshToken.destroy({ where: { userId } });
}
