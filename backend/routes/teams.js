import express from 'express';
import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
} from '../controllers/teamsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Team routes
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', authorize('admin'), createTeam);
router.put('/:id', authorize('admin'), updateTeam);
router.delete('/:id', authorize('admin'), deleteTeam);

// Team members routes
router.get('/:id/members', getTeamMembers);
router.post('/:id/members', authorize('admin'), addTeamMember);
router.put('/:id/members/:memberId', authorize('admin'), updateTeamMember);
router.delete('/:id/members/:memberId', authorize('admin'), deleteTeamMember);

export default router;