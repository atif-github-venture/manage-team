import express from 'express';
import {
    getAssociateView,
    getTeamMonthlyView,
    getIndividualView,
    getTeamView
} from '../controllers/timeTrendController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/associate', getAssociateView);
router.get('/team/monthly', getTeamMonthlyView);
router.get('/team', getTeamView);
router.get('/individual', getIndividualView);

export default router;