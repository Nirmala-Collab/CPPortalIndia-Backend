import express from 'express';

import { getCompanies } from '../controllers/company.controller.js';
import { getCorporates } from '../controllers/corporate.controller.js';
import { syncMasters } from '../controllers/masterData.controller.js';

const router = express.Router();
router.post('/sync', syncMasters);
router.get('/corporates', getCorporates);
router.get('/companies', getCompanies);

export default router;
