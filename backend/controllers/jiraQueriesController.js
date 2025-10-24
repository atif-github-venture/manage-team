import JiraQuery from '../models/JiraQuery.js';
import AuditLog from '../models/AuditLog.js';

export const getJQLsByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const queries = await JiraQuery.find({ teamId })
            .sort({ createdAt: -1 })
            .populate('createdBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            data: queries
        });
    } catch (error) {
        console.error('Get JQLs by team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getJQLById = async (req, res) => {
    try {
        const query = await JiraQuery.findById(req.params.id)
            .populate('teamId', 'teamName')
            .populate('createdBy', 'firstName lastName email');

        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'JQL query not found'
            });
        }

        res.status(200).json({
            success: true,
            data: query
        });
    } catch (error) {
        console.error('Get JQL by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const createJQL = async (req, res) => {
    try {
        const { teamId, jqlKey, jql, description } = req.body;

        // Validate required fields
        if (!teamId || !jqlKey || !jql || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Check if JQL key already exists for this team
        const existingQuery = await JiraQuery.findOne({ teamId, jqlKey });
        if (existingQuery) {
            return res.status(400).json({
                success: false,
                message: 'JQL key already exists for this team'
            });
        }

        const query = await JiraQuery.create({
            teamId,
            jqlKey,
            jql,
            description,
            createdBy: req.user._id
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'JiraQuery',
            resourceId: query._id,
            changes: {
                after: query
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        const populatedQuery = await JiraQuery.findById(query._id)
            .populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: populatedQuery,
            message: 'JQL query created successfully'
        });
    } catch (error) {
        console.error('Create JQL error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

export const updateJQL = async (req, res) => {
    try {
        const query = await JiraQuery.findById(req.params.id);

        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'JQL query not found'
            });
        }

        const oldQuery = query.toJSON();

        // Check if updating jqlKey would create duplicate for team
        if (req.body.jqlKey && req.body.jqlKey !== query.jqlKey) {
            const existingQuery = await JiraQuery.findOne({
                teamId: query.teamId,
                jqlKey: req.body.jqlKey,
                _id: { $ne: query._id }
            });
            if (existingQuery) {
                return res.status(400).json({
                    success: false,
                    message: 'JQL key already exists for this team'
                });
            }
        }

        Object.assign(query, req.body);
        await query.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'JiraQuery',
            resourceId: query._id,
            changes: {
                before: oldQuery,
                after: query
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        const populatedQuery = await JiraQuery.findById(query._id)
            .populate('createdBy', 'firstName lastName email');

        res.status(200).json({
            success: true,
            data: populatedQuery,
            message: 'JQL query updated successfully'
        });
    } catch (error) {
        console.error('Update JQL error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteJQL = async (req, res) => {
    try {
        const query = await JiraQuery.findById(req.params.id);

        if (!query) {
            return res.status(404).json({
                success: false,
                message: 'JQL query not found'
            });
        }

        await query.deleteOne();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'JiraQuery',
            resourceId: query._id,
            changes: {
                before: query
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'JQL query deleted successfully'
        });
    } catch (error) {
        console.error('Delete JQL error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};