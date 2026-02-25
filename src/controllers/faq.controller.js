import { sendEmail } from '../services/email.service.js';
import { faqRmNotification } from '../utils/mailContent.js';
export async function sendFaqEmail(req, res) {
  const { user_email, user_name, user_company, rmEmail } = req.body;
  console.log('FAQ Email Req Body:', req.body);
  await sendEmail({
    to: user_email,
    cc: [rmEmail],
    subject: faqRmNotification.subject,
    html: faqRmNotification.body(user_name, user_company),
  });
  res.json({ message: 'Email sent successfully' });
}
