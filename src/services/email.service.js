// src/services/email.service.js
import transporter from '../config/mailer.js';

export async function sendEmail({ to, cc = [], subject, html, meta = {} }) {
  // meta can include correlationId, otpId, userId, etc.
  const start = process.hrtime.bigint(); // high-resolution start

  try {
    const info = await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to,
      cc,
      subject,
      html,
    });

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6; // convert ns -> ms

    // Structured success log (single-line JSON)
    console.log(JSON.stringify({
      level: 'info',
      ts: new Date().toISOString(),
      event: 'otp_email_send',
      status: 'success',
      to,
      subject,
      duration_ms: Math.round(durationMs),
      provider_response: info?.response || null,
      messageId: info?.messageId || null,
      ...meta, // correlationId, otpId, userId, env, etc.
    }));

    return info;
  } catch (error) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    // Structured error log (single-line JSON)
    console.error(JSON.stringify({
      level: 'error',
      ts: new Date().toISOString(),
      event: 'otp_email_send',
      status: 'failure',
      to,
      subject,
      duration_ms: Math.round(durationMs),
      error: error?.message || String(error),
      ...meta,
    }));

    // Re-throw for upstream handling if needed
    throw new Error(`Email send failed: ${error?.message || error}`);
  }
}
