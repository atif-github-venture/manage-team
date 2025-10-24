import express from 'express';
import {
    calculateFutureCapacity,
    getCapacityByTeam,
    getCapacityByDateRange
} from '../controllers/futureCapacityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/calculate', calculateFutureCapacity);
router.get('/team/:teamId', getCapacityByTeam);
router.get('/date-range', getCapacityByDateRange);

export default router;