import express from 'express';

import { uploadPolicyDeclaration } from '../controllers/policy.controller.js';
import { upload } from '../utils/uploadDocuments.js';
const router = express.Router();
router.post(
  '/:refId/declarations/upload',
  upload.single('policyDeclaration'),
  uploadPolicyDeclaration
);
export default router;
