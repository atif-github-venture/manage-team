import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT']
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['User', 'Team', 'Holiday', 'PTO', 'TeamMember', 'EmailSchedule', 'Settings', 'DistributionList', 'JiraQuery']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    changes: {
        before: {
            type: mongoose.Schema.Types.Mixed
        },
        after: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failure'],
        default: 'success'
    },
    errorMessage: {
        type: String
    },
    details: {
        type: String
    }
}, {
    timestamps: false
});

// Indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

// TTL index to auto-delete old logs after 1 year
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

// Transform output
auditLogSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;