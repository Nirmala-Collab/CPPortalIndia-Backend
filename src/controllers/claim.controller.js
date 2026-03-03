import { request } from 'http';
import Document from '../models/document.model.js';
import { sendEmail } from '../services/email.service.js';
import { uploadDocClient, rmCallbackRequest } from '../utils/mailContent.js';
import { v4 as uuidv4 } from 'uuid';

const requestId = uuidv4();
export async function requestRmCallback(req, res) {
  let email, rm, req_no;
  const { refId } = req.params.refId;
  const {
    claim_manager_email,
    insurer_claim_no,
    rm_email,
    insurer_policy_no,
    src,
    user_email,
    user_name,
  } = req.body;
  if (src == 'RENEWAL') {
    email = rm_email;
    req_no = insurer_policy_no;
  } else {
    email = claim_manager_email;
    req_no = insurer_claim_no;
    rm = rm_email;
  }
  await sendEmail({
    to: user_email,
    cc: rm,
    bcc: email,
    subject: rmCallbackRequest.subject,
    html: rmCallbackRequest.body(requestId, user_name),
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
        bcc: claims_manager_email,
        cc: rm_email,
        // cc: [claims_manager_email, rm_email].filter(Boolean),
        subject: uploadDocClient.subject,
        html: uploadDocClient.body(requestId, claims_id),
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
