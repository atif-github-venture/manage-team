import Joi from 'joi';

export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.body = value;
        next();
    };
};

export const schemas = {
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    }),

    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        role: Joi.string().valid('admin', 'viewer').default('viewer')
    }),

    changePassword: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required()
    }),

    createTeam: Joi.object({
        teamId: Joi.string().required(),
        teamName: Joi.string().required(),
        description: Joi.string().allow(''),
        jiraProject: Joi.string().allow(''),
        members: Joi.array().items(Joi.object({
            userId: Joi.string().required(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            designation: Joi.string().required()
        }))
    }),

    updateTeam: Joi.object({
        teamName: Joi.string(),
        description: Joi.string().allow(''),
        jiraProject: Joi.string().allow(''),
        active: Joi.boolean()
    }),

    createHoliday: Joi.object({
        holidayName: Joi.string().required(),
        date: Joi.date().required(),
        location: Joi.string().valid('US', 'India', 'Global').required(),
        isRecurring: Joi.boolean().default(false),
        description: Joi.string().allow('')
    }),

    updateHoliday: Joi.object({
        holidayName: Joi.string(),
        date: Joi.date(),
        location: Joi.string().valid('US', 'India', 'Global'),
        isRecurring: Joi.boolean(),
        description: Joi.string().allow('')
    }),

    createPTO: Joi.object({
        userId: Joi.string().required(),
        teamId: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref('startDate')).required(),
        type: Joi.string().valid('vacation', 'sick', 'personal', 'other').default('vacation'),
        reason: Joi.string().allow(''),
        message: Joi.string().allow('')
    }),

    updatePTO: Joi.object({
        startDate: Joi.date(),
        endDate: Joi.date(),
        type: Joi.string().valid('vacation', 'sick', 'personal', 'other'),
        status: Joi.string().valid('pending', 'approved', 'rejected'),
        reason: Joi.string().allow(''),
        message: Joi.string().allow('')
    }),

    createUser: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        role: Joi.string().valid('admin', 'viewer').default('viewer'),
        teams: Joi.array().items(Joi.string())
    }),

    updateUser: Joi.object({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        role: Joi.string().valid('admin', 'viewer'),
        teams: Joi.array().items(Joi.string()),
        active: Joi.boolean()
    }),

    timeTrendQuery: Joi.object({
        teamId: Joi.string().required(),
        userId: Joi.string(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref('startDate')).required()
    }),

    teamworkInsights: Joi.object({
        teamId: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref('startDate')).required()
    }),

    futureCapacity: Joi.object({
        teamId: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().greater(Joi.ref('startDate')).required()
    })
};

export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.query = value;
        next();
    };
};

export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.params = value;
        next();
    };
};