CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE audit_logs (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id UUID NULL,
   email VARCHAR(255) NULL,
   phone VARCHAR(20) NULL,
   action VARCHAR(50) NOT NULL,       -- LOGIN, SEND_OTP, VERIFY_OTP, LOGOUT
   status VARCHAR(20) NOT NULL,       -- SUCCESS, FAILED
   reason TEXT NOT NULL,              -- human-readable
   failure_code VARCHAR(50) NULL,     -- LOGIN_001, OTP_001, AD_002, etc.
   ip_address VARCHAR(100) NULL,
   user_agent TEXT NULL,
   created_at TIMESTAMP DEFAULT NOW()
);