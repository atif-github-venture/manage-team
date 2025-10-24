import Holiday from '../models/Holiday.js';
import AuditLog from '../models/AuditLog.js';

export const getAllHolidays = async (req, res) => {
    try {
        const { location, year, page = 1, limit = 100 } = req.query;

        const filter = {};
        if (location) filter.location = location;
        if (year) filter.year = parseInt(year);

        const holidays = await Holiday.find(filter)
            .sort({ date: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('createdBy', 'firstName lastName');

        const total = await Holiday.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: holidays,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all holidays error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getHolidayById = async (req, res) => {
    try {
        const holiday = await Holiday.findById(req.params.id);

        if (!holiday) {
            return res.status(404).json({
                success: false,
                message: 'Holiday not found'
            });
        }

        res.status(200).json({
            success: true,
            data: holiday
        });
    } catch (error) {
        console.error('Get holiday by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getHolidaysByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const { year } = req.query;

        const filter = { location };
        if (year) filter.year = parseInt(year);

        const holidays = await Holiday.find(filter).sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: holidays
        });
    } catch (error) {
        console.error('Get holidays by location error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getHolidaysByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const { location } = req.query;

        const filter = { year: parseInt(year) };
        if (location) filter.location = location;

        const holidays = await Holiday.find(filter).sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: holidays
        });
    } catch (error) {
        console.error('Get holidays by year error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const createHoliday = async (req, res) => {
    try {
        const { holidayName, date, location, isRecurring, description, hours } = req.body;

        const holiday = await Holiday.create({
            holidayName,
            date,
            location,
            year: new Date(date).getFullYear(),
            hours: hours || 8,
            isRecurring,
            description,
            createdBy: req.user._id
        });

        await AuditLog.create({
            userId: req.user._id,
            action: 'CREATE',
            resourceType: 'Holiday',
            resourceId: holiday._id,
            changes: {
                after: holiday
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            data: holiday,
            message: 'Holiday created successfully'
        });
    } catch (error) {
        console.error('Create holiday error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateHoliday = async (req, res) => {
    try {
        const holiday = await Holiday.findById(req.params.id);

        if (!holiday) {
            return res.status(404).json({
                success: false,
                message: 'Holiday not found'
            });
        }

        const oldHoliday = holiday.toJSON();

        Object.assign(holiday, req.body);
        await holiday.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'UPDATE',
            resourceType: 'Holiday',
            resourceId: holiday._id,
            changes: {
                before: oldHoliday,
                after: holiday
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            data: holiday,
            message: 'Holiday updated successfully'
        });
    } catch (error) {
        console.error('Update holiday error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteHoliday = async (req, res) => {
    try {
        const holiday = await Holiday.findById(req.params.id);

        if (!holiday) {
            return res.status(404).json({
                success: false,
                message: 'Holiday not found'
            });
        }

        await holiday.deleteOne();

        await AuditLog.create({
            userId: req.user._id,
            action: 'DELETE',
            resourceType: 'Holiday',
            resourceId: holiday._id,
            changes: {
                before: holiday
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Holiday deleted successfully'
        });
    } catch (error) {
        console.error('Delete holiday error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};