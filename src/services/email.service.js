import transporter from '../config/mailer.js';
export async function sendEmail({ to, cc = [], subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to,
      cc,
      subject,
      html,
    });
    console.log('Email sent: ', info.response);
    return info;
  } catch (error) {
    console.error('Email send failed:', error.message);
    throw new Error(`Email send failed: ${error.message}`);
  }
}
