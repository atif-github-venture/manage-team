import PTO from '../models/PTO.js';
import AuditLog from '../models/AuditLog.js';
import Team from '../models/Team.js';

export const getAllPTOs = async (req, res) => {
    try {
        const { teamId, userId, status, page = 1, limit = 50 } = req.query;

        const filter = {};
        if (teamId) filter.teamId = teamId;
        if (userId) filter.userId = userId;
        if (status) filter.status = status;

        const ptos = await PTO.find(filter)
            .populate('userId', 'firstName lastName email')
            .populate('teamId', 'teamName')
            .populate('approvedBy', 'firstName lastName')
            .sort({ startDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await PTO.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: ptos,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all PTOs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getPTOById = async (req, res) => {
    try {
        const pto = await PTO.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate('teamId', 'teamName')
            .populate('approvedBy', 'firstName lastName');

        if (!pto) {
            return res.status(404).json({
                success: false,
                message: 'PTO not found'
            });
        }

        res.status(200).json({
            success: true,
            data: pto
        });
    } catch (error) {
        console.error('Get PTO by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getPTOsByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        // Get PTOs for the team
        const ptos = await PTO.find({ teamId })
            .sort({ startDate: -1 });

        // Get team with members
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Create a map of member _id to member info
        const memberMap = {};
        team.members.forEach(member => {
            memberMap[member._id.toString()] = {
                _id: member._id,
                firstName: member.name.split(' ')[0] || member.name,
                lastName: member.name.split(' ').slice(1).join(' ') || '',
                email: member.email,
                designation: member.designation,
                name: member.name
            };
        });

        // Enrich PTOs with member information
        const enrichedPtos = ptos.map(pto => {
            const ptoObj = pto.toObject();
            const memberInfo = memberMap[ptoObj.userId?.toString()];

            return {
                ...ptoObj,
                userId: memberInfo || null
            };
        });

        res.status(200).json({
            success: true,
            data: enrichedPtos
        });
    } catch (error) {
        console.error('Get PTOs by team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Helper function to enrich PTO with member info
const enrichPTOWithMemberInfo = async (pto) => {
    try {
        const team = await Team.findById(pto.teamId);
        if (!team) return pto.toObject();

        const member = team.members.find(m => m._id.toString() === pto.userId?.toString());

        const ptoObj = pto.toObject();
        if (member) {
            ptoObj.userId = {
                _id: member._id,
                firstName: member.name.split(' ')[0] || member.name,
                lastName: member.name.split(' ').slice(1).join(' ') || '',
                email: member.email,
                designation: member.designation,
                name: member.name
            };
        }

        return ptoObj;
    } catch (error) {
        console.error('Error enriching PTO:', error);
        return pto.toObject();
    }
};

export const getPTOsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const ptos = await PTO.find({ userId })
            .populate('teamId', 'teamName')
            .sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            data: ptos
        });
    } catch (error) {
        console.error('Get PTOs by user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const createPTO = async (req, res) => {
    try {
        const { userId, teamId, startDate, endDate, duration, type, reason, message } = req.body;

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after or equal to start date'
            });
        }

        if (!duration) {
            return res.status(400).json({
                success: false,
                message: 'Duration is required'
            });
        }

        const pto = await PTO.create({
            userId,
            teamId,
            startDate,
            endDate,
            duration,
            type,
            reason,
            message,
            status: 'approved'
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'PTO',
            resourceId: pto._id,
            changes: {
                after: pto
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Enrich PTO with member information before sending response
        const enrichedPTO = await enrichPTOWithMemberInfo(pto);

        res.status(201).json({
            success: true,
            data: enrichedPTO,
            message: 'PTO created successfully'
        });
    } catch (error) {
        console.error('Create PTO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updatePTO = async (req, res) => {
    try {
        const pto = await PTO.findById(req.params.id);

        if (!pto) {
            return res.status(404).json({
                success: false,
                message: 'PTO not found'
            });
        }

        const oldPTO = pto.toJSON();

        Object.assign(pto, req.body);
        await pto.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'PTO',
            resourceId: pto._id,
            changes: {
                before: oldPTO,
                after: pto
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        // Enrich PTO with member information before sending response
        const enrichedPTO = await enrichPTOWithMemberInfo(pto);

        res.status(200).json({
            success: true,
            data: enrichedPTO,
            message: 'PTO updated successfully'
        });
    } catch (error) {
        console.error('Update PTO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deletePTO = async (req, res) => {
    try {
        const pto = await PTO.findById(req.params.id);

        if (!pto) {
            return res.status(404).json({
                success: false,
                message: 'PTO not found'
            });
        }

        await pto.deleteOne();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'PTO',
            resourceId: pto._id,
            changes: {
                before: pto
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'PTO deleted successfully'
        });
    } catch (error) {
        console.error('Delete PTO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const approvePTO = async (req, res) => {
    try {
        const pto = await PTO.findById(req.params.id);

        if (!pto) {
            return res.status(404).json({
                success: false,
                message: 'PTO not found'
            });
        }

        pto.status = 'approved';
        pto.approvedBy = req.user._id;
        pto.approvalDate = Date.now();
        await pto.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'PTO',
            resourceId: pto._id,
            details: 'PTO approved',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: pto,
            message: 'PTO approved successfully'
        });
    } catch (error) {
        console.error('Approve PTO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const rejectPTO = async (req, res) => {
    try {
        const pto = await PTO.findById(req.params.id);

        if (!pto) {
            return res.status(404).json({
                success: false,
                message: 'PTO not found'
            });
        }

        pto.status = 'rejected';
        pto.approvedBy = req.user._id;
        pto.approvalDate = Date.now();
        await pto.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'PTO',
            resourceId: pto._id,
            details: 'PTO rejected',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: pto,
            message: 'PTO rejected'
        });
    } catch (error) {
        console.error('Reject PTO error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};