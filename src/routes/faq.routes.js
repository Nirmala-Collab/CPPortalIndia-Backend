import express from 'express';

import { sendFaqEmail } from '../controllers/faq.controller.js';
const router = express.Router();
router.post('/sendFaqEmail', sendFaqEmail);
export default router;
