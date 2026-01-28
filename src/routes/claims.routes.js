import express from 'express';

import { requestRmCallback, uploadClaimDocument } from '../controllers/claim.controller.js';
import { upload } from '../utils/uploadDocuments.js';
const router = express.Router();
router.post('/:claimId/rm-callback', requestRmCallback);
router.post('/:claimId/documents/upload', upload.single('file'), uploadClaimDocument);
export default router;
