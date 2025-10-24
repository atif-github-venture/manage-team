import express from 'express';
import {
    getAllHolidays,
    getHolidayById,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    getHolidaysByLocation,
    getHolidaysByYear
} from '../controllers/holidaysController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Public routes (all authenticated users)
router.get('/', getAllHolidays);
router.get('/location/:location', getHolidaysByLocation);
router.get('/year/:year', getHolidaysByYear);
router.get('/:id', getHolidayById);

// Admin only routes
router.post('/', authorize('admin'), createHoliday);
router.put('/:id', authorize('admin'), updateHoliday);
router.delete('/:id', authorize('admin'), deleteHoliday);

export default router;