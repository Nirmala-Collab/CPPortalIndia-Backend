import express from 'express';

import { uploadPolicyDeclaration } from '../controllers/policy.controller.js';
import { upload } from '../utils/upload.js';
const router = express.Router();
router.post('/:policyId/declarations/upload', upload.single('file'), uploadPolicyDeclaration);
export default router;
