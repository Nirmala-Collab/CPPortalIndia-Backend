import { sendEmail } from '../services/email.service.js';
import { faqRmNotification } from '../utils/mailContent.js';
export async function sendFaqEmail(req, res) {
  const { user_email, user_name, user_company, rmEmail } = req.body;
  const companyNames = user_company.map((c) => c.name).join(',');
  await sendEmail({
    to: user_email,
    bcc: [rmEmail],

    subject: faqRmNotification.subject,
    html: faqRmNotification.body(user_name, companyNames),
  });

  res.json({ message: 'Email sent successfully' });
}
