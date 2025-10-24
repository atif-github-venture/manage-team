import express from 'express';
import {
    getAllPTOs,
    getPTOById,
    createPTO,
    updatePTO,
    deletePTO,
    getPTOsByTeam,
    getPTOsByUser,
    approvePTO,
    rejectPTO
} from '../controllers/ptoController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', getAllPTOs);
router.get('/team/:teamId', getPTOsByTeam);
router.get('/user/:userId', getPTOsByUser);
router.get('/:id', getPTOById);
router.post('/', createPTO);

// Admin only routes
router.put('/:id', updatePTO);
router.delete('/:id', authorize('admin'), deletePTO);
router.put('/:id/approve', authorize('admin'), approvePTO);
router.put('/:id/reject', authorize('admin'), rejectPTO);

export default router;