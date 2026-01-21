import Document from '../models/document.model.js';
import { sendEmail } from '../services/email.service.js';

export async function requestRmCallback(req, res) {
  const { claimId, rmEmail } = req.body;
  await sendEmail({
    to: rmEmail,
    subject: 'RM Callback Requested',
    html: `Client has requested a callback for claim ${claimId}`,
  });
  res.json({ message: 'Callback request sent' });
}

export async function uploadClaimDocument(req, res) {
  const { claimId, claimRmEmail, policyRmEmail } = req.body;
  const file = req.file;
  await Document.create({
    entityType: 'CLAIM',
    entityId: claimId,
    documentType: 'CLAIM_DOCUMENT',
    fileName: file.originalname,
    filePath: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
    uploadedBy: req.user.id,
  });
  await sendEmail({
    to: claimRmEmail,
    cc: [policyRmEmail],
    subject: `Claim Document Uploaded - ${claimId}`,
    html: `Document uploaded for claim ${claimId}`,
  });
  res.json({ message: 'Claim document uploaded successfully' });
}
