import express from 'express';

import { uploadPolicyDeclaration } from '../controllers/policy.controller.js';
import { upload } from '../utils/uploadDocuments.js';
const router = express.Router();
router.post(
  '/:policyId/declarations/upload',
  upload.single('profilePhoto'),
  uploadPolicyDeclaration
);
export default router;
