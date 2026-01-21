import db from '../models/index.js';
import { generateJwtToken } from '../services/jwt.service.js';
import { verifyRefreshToken, invalidateRefreshToken } from '../services/refreshToken.service.js';
const { User } = db;
export async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const tokenRecord = await verifyRefreshToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    const user = await User.findByPk(tokenRecord.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // New access token
    const newAccessToken = generateJwtToken({
      userId: user.id,
      email: user.email,
    });
    return res.status(200).json({
      token: newAccessToken,
    });
  } catch (err) {
    console.error('Refresh Token Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
