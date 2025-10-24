import express from 'express';
import {
    getJQLsByTeam,
    getJQLById,
    createJQL,
    updateJQL,
    deleteJQL
} from '../controllers/jiraQueriesController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all JQLs for a team (all authenticated users)
router.get('/team/:teamId', getJQLsByTeam);

// Get single JQL by ID (all authenticated users)
router.get('/:id', getJQLById);

// Admin only routes
router.post('/', authorize('admin'), createJQL);
router.put('/:id', authorize('admin'), updateJQL);
router.delete('/:id', authorize('admin'), deleteJQL);

export default router;