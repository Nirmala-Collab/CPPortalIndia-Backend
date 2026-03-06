// Simple 60s cooldown per EMAIL and per IP.
// Works great for a single Node process (UAT / small prod).
const COOLDOWN_MS = 60_000;

// In-memory stores (cleared on process restart)
const lastByEmail = new Map(); // email -> last timestamp ms
const lastByIp = new Map(); // ip -> last timestamp ms

export function otpLimiter(req, res, next) {
    // 1) Read email safely
    const email = (req.body?.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // 2) Resolve client IP (respects reverse proxy header if present)
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
        .split(',')[0].trim();

    const now = Date.now();

    // 3) Enforce per-email 60s cooldown
    const emailLeft = COOLDOWN_MS - (now - (lastByEmail.get(email) || 0));
    if (emailLeft > 0) {
        return res.status(429).json({
            message: `OTP recently sent. Retry after ${Math.ceil(emailLeft / 1000)}s.`,
        });
    }

    // 4) Enforce per-IP 60s cooldown
    const ipLeft = COOLDOWN_MS - (now - (lastByIp.get(ip) || 0));
    if (ipLeft > 0) {
        return res.status(429).json({
            message: `Too many requests from this IP. Retry after ${Math.ceil(ipLeft / 1000)}s.`,
        });
    }

    // 5) Stamp the send time (so the next request is throttled)
    lastByEmail.set(email, now);
    lastByIp.set(ip, now);

    // 6) Continue to your existing sendOtp handler
    return next();
}
