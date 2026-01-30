import express from 'express';

import { requestRmCallback, uploadClaimDocument } from '../controllers/claim.controller.js';
import { upload } from '../utils/uploadDocuments.js';
const router = express.Router();
router.post('/:refId/rm-callback', requestRmCallback);
router.post('/:refId/documents/upload', upload.single('claims'), uploadClaimDocument);
export default router;
