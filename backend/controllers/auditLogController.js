import AuditLog from '../models/AuditLog.js';

export const getAllAuditLogs = async (req, res) => {
    try {
        const {
            userId,
            action,
            resourceType,
            status,
            startDate,
            endDate,
            page = 1,
            limit = 50
        } = req.query;

        const filter = {};

        if (userId) filter.userId = userId;
        if (action) filter.action = action;
        if (resourceType) filter.resourceType = resourceType;
        if (status) filter.status = status;

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const auditLogs = await AuditLog.find(filter)
            .populate('userId', 'firstName lastName email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AuditLog.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: auditLogs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all audit logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getAuditLogById = async (req, res) => {
    try {
        const auditLog = await AuditLog.findById(req.params.id)
            .populate('userId', 'firstName lastName email');

        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: 'Audit log not found'
            });
        }

        res.status(200).json({
            success: true,
            data: auditLog
        });
    } catch (error) {
        console.error('Get audit log by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getAuditLogsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const auditLogs = await AuditLog.find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AuditLog.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: auditLogs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get audit logs by user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getAuditLogsByResource = async (req, res) => {
    try {
        const { resourceType } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const auditLogs = await AuditLog.find({ resourceType })
            .populate('userId', 'firstName lastName email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AuditLog.countDocuments({ resourceType });

        res.status(200).json({
            success: true,
            data: auditLogs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get audit logs by resource error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getAuditLogsByAction = async (req, res) => {
    try {
        const { action } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const auditLogs = await AuditLog.find({ action })
            .populate('userId', 'firstName lastName email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AuditLog.countDocuments({ action });

        res.status(200).json({
            success: true,
            data: auditLogs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get audit logs by action error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getAuditLogsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { page = 1, limit = 50 } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const filter = {
            timestamp: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        const auditLogs = await AuditLog.find(filter)
            .populate('userId', 'firstName lastName email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AuditLog.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: auditLogs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get audit logs by date range error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};