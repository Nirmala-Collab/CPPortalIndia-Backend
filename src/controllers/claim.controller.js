import Document from '../models/document.model.js';
import { sendEmail } from '../services/email.service.js';
import { uploadDocClient, rmCallbackRequest } from '../utils/mailContent.js';
export async function requestRmCallback(req, res) {
  const { refId } = req.params.refId;
  const { claim_manager_email, insurer_claim_no, user_email, user_name } = req.body;
  await sendEmail({
    to: user_email,
    cc: [claim_manager_email],
    subject: rmCallbackRequest.subject,
    html: rmCallbackRequest.body(insurer_claim_no, user_name),
  });
  res.json({ message: 'Callback request sent' });
}

export async function uploadClaimDocument(req, res) {
  try {
    const { refId } = req.params;
    const { claims_manager_email, rm_email, user_email, claims_id } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Use form field name "file".' });
    }

    const documentPath = `/uploads/documents/claims/${req.file.filename}`;

    const document = await Document.create({
      entityType: 'CLAIM',
      entityId: claims_id,
      documentType: 'CLAIM_DOCUMENT',
      fileName: req.file.originalname,
      filePath: documentPath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.user?.id || null,
    });

    if (claims_manager_email || rm_email) {
      await sendEmail({
        to: user_email,
        cc: [claims_manager_email, rm_email].filter(Boolean),
        subject: uploadDocClient.subject,
        html: uploadDocClient.body(claims_id),
      });
    }

    return res.status(200).json({
      message: 'Claim document uploaded successfully',
      document,
    });
  } catch (error) {
    console.error('Upload Claim Document Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
