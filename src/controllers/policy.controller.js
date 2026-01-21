import Document from '../models/document.model.js';
import { sendEmail } from '../services/email.service.js';
export async function uploadPolicyDeclaration(req, res) {
  const { policyId, month, year, rmEmail } = req.body;
  const file = req.file;
  await Document.create({
    entityType: 'POLICY',
    entityId: policyId,
    documentType: 'DECLARATION',
    fileName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
    uploadedBy: req.user.id,
  });
  await sendEmail({
    to: ['pas@company.com'],
    cc: [rmEmail, 'ops@company.com'],
    subject: `Declaration Uploaded – Policy ${policyId}`,
    html: `
     Declaration uploaded for policy ${policyId}
<br/>Period: ${month}/${year}
   `,
  });
  res.json({ message: 'Declaration uploaded successfully' });
}
