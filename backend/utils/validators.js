import Joi from 'joi';

export const emailValidator = Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
});

export const passwordValidator = Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required'
});

export const objectIdValidator = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid ID format'
});

export const dateValidator = Joi.date().iso().messages({
    'date.base': 'Invalid date format',
    'date.format': 'Date must be in ISO format'
});

export const schemas = {
    auth: {
        login: Joi.object({
            email: emailValidator,
            password: passwordValidator
        }),

        register: Joi.object({
            email: emailValidator,
            password: passwordValidator,
            firstName: Joi.string().min(2).max(50).required(),
            lastName: Joi.string().min(2).max(50).required(),
            role: Joi.string().valid('admin', 'viewer').default('viewer')
        }),

        changePassword: Joi.object({
            currentPassword: Joi.string().required(),
            newPassword: passwordValidator
        }),

        refreshToken: Joi.object({
            refreshToken: Joi.string().required()
        })
    },

    user: {
        create: Joi.object({
            email: emailValidator,
            password: passwordValidator,
            firstName: Joi.string().min(2).max(50).required(),
            lastName: Joi.string().min(2).max(50).required(),
            role: Joi.string().valid('admin', 'viewer').default('viewer'),
            teams: Joi.array().items(objectIdValidator)
        }),

        update: Joi.object({
            firstName: Joi.string().min(2).max(50),
            lastName: Joi.string().min(2).max(50),
            role: Joi.string().valid('admin', 'viewer'),
            teams: Joi.array().items(objectIdValidator),
            active: Joi.boolean()
        }),

        updateRole: Joi.object({
            role: Joi.string().valid('admin', 'viewer').required()
        }),

        resetPassword: Joi.object({
            newPassword: passwordValidator
        })
    },

    team: {
        create: Joi.object({
            teamId: Joi.string().min(2).max(50).required(),
            teamName: Joi.string().min(2).max(100).required(),
            description: Joi.string().max(500).allow(''),
            jiraProject: Joi.string().max(50).allow(''),
            members: Joi.array().items(Joi.object({
                userId: objectIdValidator.required(),
                name: Joi.string().required(),
                email: emailValidator,
                designation: Joi.string().required()
            }))
        }),

        update: Joi.object({
            teamName: Joi.string().min(2).max(100),
            description: Joi.string().max(500).allow(''),
            jiraProject: Joi.string().max(50).allow(''),
            active: Joi.boolean()
        }),

        addMember: Joi.object({
            userId: objectIdValidator.required(),
            name: Joi.string().required(),
            email: emailValidator,
            designation: Joi.string().required()
        })
    },

    holiday: {
        create: Joi.object({
            holidayName: Joi.string().min(2).max(100).required(),
            date: dateValidator.required(),
            location: Joi.string().valid('US', 'India', 'Global').required(),
            isRecurring: Joi.boolean().default(false),
            description: Joi.string().max(500).allow('')
        }),

        update: Joi.object({
            holidayName: Joi.string().min(2).max(100),
            date: dateValidator,
            location: Joi.string().valid('US', 'India', 'Global'),
            isRecurring: Joi.boolean(),
            description: Joi.string().max(500).allow('')
        }),

        query: Joi.object({
            location: Joi.string().valid('US', 'India', 'Global'),
            year: Joi.number().integer().min(2020).max(2030),
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(100)
        })
    },

    pto: {
        create: Joi.object({
            userId: objectIdValidator.required(),
            teamId: objectIdValidator.required(),
            startDate: dateValidator.required(),
            endDate: dateValidator.greater(Joi.ref('startDate')).required(),
            type: Joi.string().valid('vacation', 'sick', 'personal', 'other').default('vacation'),
            reason: Joi.string().max(500).allow(''),
            message: Joi.string().max(500).allow('')
        }),

        update: Joi.object({
            startDate: dateValidator,
            endDate: dateValidator,
            type: Joi.string().valid('vacation', 'sick', 'personal', 'other'),
            status: Joi.string().valid('pending', 'approved', 'rejected'),
            reason: Joi.string().max(500).allow(''),
            message: Joi.string().max(500).allow('')
        }),

        query: Joi.object({
            teamId: objectIdValidator,
            userId: objectIdValidator,
            status: Joi.string().valid('pending', 'approved', 'rejected'),
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(50)
        })
    },

    timeTrend: {
        associateView: Joi.object({
            teamId: Joi.string().required(),
            userId: Joi.string(),
            startDate: dateValidator.required(),
            endDate: dateValidator.greater(Joi.ref('startDate')).required()
        }),

        teamMonthly: Joi.object({
            teamId: Joi.string().required(),
            year: Joi.number().integer().min(2020).max(2030).required(),
            month: Joi.number().integer().min(1).max(12).required()
        })
    },

    insights: {
        generate: Joi.object({
            teamId: Joi.string().required(),
            startDate: dateValidator.required(),
            endDate: dateValidator.greater(Joi.ref('startDate')).required()
        })
    },

    capacity: {
        calculate: Joi.object({
            teamId: Joi.string().required(),
            startDate: dateValidator.required(),
            endDate: dateValidator.greater(Joi.ref('startDate')).required()
        })
    },

    auditLog: {
        query: Joi.object({
            userId: objectIdValidator,
            action: Joi.string().valid('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT'),
            resourceType: Joi.string().valid('User', 'Team', 'Holiday', 'PTO', 'TeamMember', 'EmailSchedule', 'Settings'),
            status: Joi.string().valid('success', 'failure'),
            startDate: dateValidator,
            endDate: dateValidator,
            page: Joi.number().integer().min(1).default(1),
            limit: Joi.number().integer().min(1).max(100).default(50)
        })
    },

    distributionList: {
        create: Joi.object({
            name: Joi.string().trim().min(3).max(100).required(),
            purpose: Joi.string().trim().min(3).max(200).required(),
            emails: Joi.array().items(Joi.string().email()).min(1).max(100).required(),
            status: Joi.string().valid('active', 'inactive').default('active'),
            teamId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
            description: Joi.string().trim().max(500).allow('')
        }),

        update: Joi.object({
            name: Joi.string().trim().min(3).max(100),
            purpose: Joi.string().trim().min(3).max(200),
            emails: Joi.array().items(Joi.string().email()).min(1).max(100),
            status: Joi.string().valid('active', 'inactive'),
            teamId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null, ''),
            description: Joi.string().trim().max(500).allow('')
        })
    }
};

export const validateEmail = (email) => {
    const schema = Joi.string().email();
    const { error } = schema.validate(email);
    return !error;
};

export const validatePassword = (password) => {
    const schema = Joi.string().min(8);
    const { error } = schema.validate(password);
    return !error;
};

export const validateObjectId = (id) => {
    const schema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
    const { error } = schema.validate(id);
    return !error;
};

export const validateDateRange = (startDate, endDate) => {
    const schema = Joi.object({
        startDate: dateValidator.required(),
        endDate: dateValidator.greater(Joi.ref('startDate')).required()
    });

    const { error } = schema.validate({ startDate, endDate });
    return !error;
};

export default schemas;