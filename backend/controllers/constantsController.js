import { LOCATIONS, USER_ROLES, PTO_TYPES, PTO_STATUS } from '../utils/constants.js';

export const getConstants = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                LOCATIONS,
                USER_ROLES,
                PTO_TYPES,
                PTO_STATUS
            }
        });
    } catch (error) {
        console.error('Get constants error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};