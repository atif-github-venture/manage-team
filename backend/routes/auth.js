import express from 'express';
import {
    login,
    logout,
    refreshToken,
    changePassword,
    getCurrentUser
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/password', changePassword);

export default router;