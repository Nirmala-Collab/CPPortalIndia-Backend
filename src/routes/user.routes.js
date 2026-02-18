import express from 'express';

import { uploadProfilePhoto, userPolicyAcceptance } from '../controllers/user.controller.js';
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUsersByType,
  getUserById,
  getUsersByRoles,
  getUserByName,
  userPolicyAcceptance,
} from '../controllers/user.controller.js';
import { uploadProfile } from '../utils/uploadProfile.js';
const router = express.Router();
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/', getUsers);
router.get('/user-by-role', getUsersByRoles);
router.get('/userType/:usertype', getUsersByType);
router.get('/name/:name', getUserByName);
router.get('/:id', getUserById);
router.post('/:id/accept-policies', userPolicyAcceptance);
router.post('/:id/profile-photo', uploadProfile.single('profilePhoto'), uploadProfilePhoto);

export default router;
