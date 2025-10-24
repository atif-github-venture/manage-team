import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const getAllUsers = async (req, res) => {
    try {
        const { role, active, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (role) filter.role = role;
        if (active !== undefined) filter.active = active === 'true';

        const users = await User.find(filter)
            .populate('teams', 'teamName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('teams', 'teamName description');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, teams } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: role || 'viewer',
            teams: teams || []
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'User',
            resourceId: user._id,
            changes: {
                after: user
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            data: userResponse,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const oldUser = user.toJSON();

        const { password, ...updateData } = req.body;

        Object.assign(user, updateData);
        await user.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'User',
            resourceId: user._id,
            changes: {
                before: oldUser,
                after: user
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        await user.deleteOne();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'User',
            resourceId: user._id,
            changes: {
                before: user
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['admin', 'viewer'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change your own role'
            });
        }

        const oldRole = user.role;
        user.role = role;
        await user.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'User',
            resourceId: user._id,
            details: `Role changed from ${oldRole} to ${role}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: user,
            message: 'User role updated successfully'
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const resetUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = newPassword;
        await user.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'User',
            resourceId: user._id,
            details: 'Password reset by admin',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset user password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};