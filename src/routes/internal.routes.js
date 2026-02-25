import express from 'express';
import { updateTestUserRole } from '../controllers/internal.controller.js';

const router = express.Router();

router.put('/switch-user-role', updateTestUserRole);

export default router;
