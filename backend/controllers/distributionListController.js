import DistributionList from '../models/DistributionList.js';
import { schemas } from '../utils/validators.js';
import AuditLog from '../models/AuditLog.js';

export const getAll = async (req, res) => {
    try {
        const { status, teamId, sort = 'name', page = 1, limit = 50 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (teamId) filter.teamId = teamId;

        const skip = (page - 1) * limit;

        const lists = await DistributionList.find(filter)
            .populate('teamId', 'teamName')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await DistributionList.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: lists,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all distribution lists error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getById = async (req, res) => {
    try {
        const list = await DistributionList.findById(req.params.id)
            .populate('teamId', 'teamName')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');

        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Distribution list not found'
            });
        }

        res.status(200).json({
            success: true,
            data: list
        });
    } catch (error) {
        console.error('Get distribution list by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const create = async (req, res) => {
    try {
        const { error } = schemas.distributionList.create.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { name, purpose, emails, status, teamId, description } = req.body;

        // Check if name already exists
        const existing = await DistributionList.findOne({ name });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Distribution list with this name already exists'
            });
        }

        // Remove duplicate emails
        const uniqueEmails = [...new Set(emails)];

        const list = await DistributionList.create({
            name,
            purpose,
            emails: uniqueEmails,
            status: status || 'active',
            teamId: teamId || null,
            description: description || '',
            createdBy: req.user._id
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'DistributionList',
            resourceId: list._id,
            changes: {
                after: list
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            data: list,
            message: 'Distribution list created successfully'
        });
    } catch (error) {
        console.error('Create distribution list error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const update = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const { error } = schemas.distributionList.update.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const list = await DistributionList.findById(req.params.id);
        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Distribution list not found'
            });
        }

        const oldList = list.toJSON();

        const { name, purpose, emails, status, teamId, description } = req.body;

        // Check if new name conflicts with existing list
        if (name && name !== list.name) {
            const existing = await DistributionList.findOne({ name });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Distribution list with this name already exists'
                });
            }
        }

        // Update fields
        if (name) list.name = name;
        if (purpose) list.purpose = purpose;
        if (emails) list.emails = [...new Set(emails)];
        if (status) list.status = status;
        if (teamId !== undefined) list.teamId = teamId || null;
        if (description !== undefined) list.description = description;
        list.updatedBy = req.user._id;

        await list.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'DistributionList',
            resourceId: list._id,
            changes: {
                before: oldList,
                after: list
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: list,
            message: 'Distribution list updated successfully'
        });
    } catch (error) {
        console.error('Update distribution list error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteDist = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const list = await DistributionList.findById(req.params.id);
        if (!list) {
            return res.status(404).json({
                success: false,
                message: 'Distribution list not found'
            });
        }

        await list.deleteOne();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'DistributionList',
            resourceId: list._id,
            changes: {
                before: list
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Distribution list deleted successfully'
        });
    } catch (error) {
        console.error('Delete distribution list error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};