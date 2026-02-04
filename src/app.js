// src/app.js
import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { scheduleUserDeactivationJob } from './jobs/userDeactivation.job.js';
import db from './models/index.js';
import accessRightsRoutes from './routes/accessRights.routes.js';
import authRoutes from './routes/auth.routes.js';
import authTypeRoutes from './routes/authenticationType.routes.js';
import claimRoutes from './routes/claims.routes.js';
import faqRoutes from './routes/faq.routes.js';
import masterDataRoutes from './routes/masterData.routes.js';
import policyRoutes from './routes/policy.routes.js';
import roleRoutes from './routes/role.routes.js';
import roleAccessRightsRoutes from './routes/roleAccessRight.routes.js';
import userRoutes from './routes/user.routes.js';
import { seedAuthenticationTypes } from './seed/authenticationTypes.seed.js';
dotenv.config('path', '.env.qa');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5001',
      'http://10.10.2.9:5001',
      'http://localhost:5002',
      'http://localhost:5003',
      'http://localhost:5004',
      'http://localhost:5005',
      'http://10.10.2.9:5002',
      'http://10.10.2.9:5003',
      'http://10.10.10.4:5005',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});
app.use('/api/auth', authRoutes);

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established');
    await db.sequelize.sync({ alter: true });
    console.log('Models synchronized');
    await seedAuthenticationTypes();
  } catch (error) {
    console.error('DB connection error:', error);
  }
})();

scheduleUserDeactivationJob();
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/authType', authTypeRoutes);
app.use('/api/accessRights', accessRightsRoutes);
app.use('/api/masterDataSync', masterDataRoutes);
app.use('/api/roleAccessRights', roleAccessRightsRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

export default app;
