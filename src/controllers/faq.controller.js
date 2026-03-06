import { sendEmail } from '../services/email.service.js';
import { faqRmNotification } from '../utils/mailContent.js';
import { v4 as uuidv4 } from 'uuid';

export async function sendFaqEmail(req, res) {
  const requestId = uuidv4();
  const { user_email, user_name, user_company, rmEmail } = req.body;
  const companyNames = user_company.map((c) => c.name).join(',');
  await sendEmail({
    to: user_email,
    bcc: [rmEmail],

    subject: faqRmNotification.subject,
    html: faqRmNotification.body(requestId, user_name, companyNames),
  });

  res.json({ message: 'Email sent successfully' });
}
