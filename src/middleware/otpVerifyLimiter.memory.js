// Blocks rapid-fire verify-otp attacks from the same IP+email.
// Window: 5s, Allow: 3 tries per window. Return 429 if exceeded.
const WINDOW_MS = 5_000;
const MAX_BURST = 3;

// key: `${ip}:${email}` -> [timestamps]
const buckets = new Map();

export function otpVerifyLimiter(req, res, next) {
  const email = (req.body?.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
    .split(',')[0].trim();
  const key = `${ip}:${email}`;
  const now = Date.now();

  const arr = (buckets.get(key) || []).filter(t => now - t <= WINDOW_MS);
  if (arr.length >= MAX_BURST) {
    const retry = Math.ceil((WINDOW_MS - (now - arr[0])) / 1000);
    return res.status(429).json({ message: `Too many OTP verification attempts. Retry after ${retry}s.` });
  }

  arr.push(now);
  buckets.set(key, arr);
  next();
}
