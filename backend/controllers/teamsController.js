import Team from '../models/Team.js';
import TeamMember from '../models/TeamMember.js';
import AuditLog from '../models/AuditLog.js';

export const getAllTeams = async (req, res) => {
    try {
        const { active, sort = 'teamName', page = 1, limit = 20 } = req.query;

        const filter = {};
        if (active !== undefined) {
            filter.active = active === 'true';
        }

        const sortOption = {};
        if (sort === 'name') {
            sortOption.teamName = 1;
        } else if (sort === 'created') {
            sortOption.createdAt = -1;
        }

        const teams = await Team.find(filter)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('createdBy', 'firstName lastName email');

        const total = await Team.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: teams,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all teams error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('members.userId', 'firstName lastName email');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: team
        });
    } catch (error) {
        console.error('Get team by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const createTeam = async (req, res) => {
    try {
        const { teamId, teamName, description, jiraProject, location, members } = req.body;

        const existingTeam = await Team.findOne({ teamId });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team ID already exists'
            });
        }

        const team = await Team.create({
            teamId,
            teamName,
            description,
            jiraProject,
            location: location || 'US',
            members: members || [],
            createdBy: req.user._id
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'Team',
            resourceId: team._id,
            changes: {
                after: team
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            data: team,
            message: 'Team created successfully'
        });
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const oldTeam = team.toJSON();

        Object.assign(team, req.body);
        await team.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'Team',
            resourceId: team._id,
            changes: {
                before: oldTeam,
                after: team
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: team,
            message: 'Team updated successfully'
        });
    } catch (error) {
        console.error('Update team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.deleteOne();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'Team',
            resourceId: team._id,
            changes: {
                before: team
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getTeamMembers = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('members.userId', 'firstName lastName email');

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.status(200).json({
            success: true,
            data: team.members
        });
    } catch (error) {
        console.error('Get team members error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const addTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const { userId, name, email, designation, jiraAccountId } = req.body;

        // Check if member exists (by email since userId might not exist)
        const memberExists = team.members.some(
            m => m.email.toString() === email
        );

        if (memberExists) {
            return res.status(400).json({
                success: false,
                message: 'Member with this email already exists in team'
            });
        }

        team.members.push({
            userId,
            name,
            email,
            designation,
            jiraAccountId
        });

        await team.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'TeamMember',
            resourceId: team._id,
            details: `Added member: ${name}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            data: team.members,
            message: 'Member added successfully'
        });
    } catch (error) {
        console.error('Add team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const member = team.members.id(req.params.memberId);


        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        Object.assign(member, req.body);
        await team.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'TeamMember',
            resourceId: team._id,
            details: `Updated member: ${member.name}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: member,
            message: 'Member updated successfully'
        });
    } catch (error) {
        console.error('Update team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteTeamMember = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const member = team.members.id(req.params.memberId);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        // CHANGE THIS LINE - use pull() or remove()
        team.members.pull(req.params.memberId); // or: member.remove();
        await team.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'TeamMember',
            resourceId: team._id,
            details: `Removed member: ${member.name}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Member removed successfully'
        });
    } catch (error) {
        console.error('Delete team member error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};