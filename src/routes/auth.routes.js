import express from 'express';

import { login, sendOtp, verifyOtp } from '../controllers/auth.controller.js';
import { refreshAccessToken } from '../controllers/refreshToken.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/token/refresh', refreshAccessToken);
export default router;
