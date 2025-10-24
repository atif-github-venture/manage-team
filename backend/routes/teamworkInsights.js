import express from 'express';
import {
    generateTeamworkInsights,
    exportInsightsHTML,
    sendInsightsEmail
} from '../controllers/teamworkInsightsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Generate team insights
router.post('/generate', generateTeamworkInsights);

// Export insights as HTML
router.post('/export-html', exportInsightsHTML);

// Send insights via email (admin only for manual trigger)
router.post('/send-email', sendInsightsEmail);

export default router;