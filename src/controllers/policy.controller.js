import Document from '../models/document.model.js';
import { sendEmail } from '../services/email.service.js';
import { uploadDeclaration } from '../utils/mailContent.js';
export async function uploadPolicyDeclaration(req, res) {
  try {
    const { refId } = req.params;
    const { policy_manager_email, policy_no, user_email, user_name } = req.body;
    const file = req.file;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Use form field name "file".' });
    }

    const documentPath = `/uploads/documents/declarations/${req.file.filename}`;

    await Document.create({
      entityType: 'POLICY',
      entityId: policy_no,
      documentType: 'DECLARATION',
      fileName: file.originalname,
      filePath: documentPath,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: req.user.id,
    });
    await sendEmail({
      to: user_email,
      cc: [policy_manager_email],
      subject: uploadDeclaration.subject,
      html: uploadDeclaration.body(policy_no),
    });
    res.json({ message: 'Declaration uploaded successfully' });
  } catch (error) {
    console.error('Upload Policy Declaration Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
