import express from 'express';
import {
    getAllAuditLogs,
    getAuditLogById,
    getAuditLogsByUser,
    getAuditLogsByResource,
    getAuditLogsByAction,
    getAuditLogsByDateRange
} from '../controllers/auditLogController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getAllAuditLogs);
router.get('/:id', getAuditLogById);
router.get('/user/:userId', getAuditLogsByUser);
router.get('/resource/:resourceType', getAuditLogsByResource);
router.get('/action/:action', getAuditLogsByAction);
router.get('/date-range', getAuditLogsByDateRange);

export default router;