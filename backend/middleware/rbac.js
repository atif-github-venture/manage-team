export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

export const checkResourceOwnership = (resourceField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (req.user.role === 'admin') {
            return next();
        }

        const resourceUserId = req.body[resourceField] || req.params[resourceField];

        if (!resourceUserId) {
            return res.status(400).json({
                success: false,
                message: 'Resource user ID not provided'
            });
        }

        if (resourceUserId !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

        next();
    };
};

export const checkTeamMembership = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (req.user.role === 'admin') {
            return next();
        }

        const teamId = req.params.teamId || req.body.teamId || req.query.teamId;

        if (!teamId) {
            return res.status(400).json({
                success: false,
                message: 'Team ID not provided'
            });
        }

        const isMember = req.user.teams.some(
            team => team.toString() === teamId
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this team'
            });
        }

        next();
    } catch (error) {
        console.error('Check team membership error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};