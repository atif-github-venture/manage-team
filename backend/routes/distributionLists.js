import express from 'express';
import * as distributionListController from '../controllers/distributionListController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// All authenticated users can access these routes
router.get('/', distributionListController.getAll);
router.get('/:id', distributionListController.getById);
router.post('/', distributionListController.create);
router.put('/:id', distributionListController.update);
router.delete('/:id', distributionListController.deleteDist);

export default router;