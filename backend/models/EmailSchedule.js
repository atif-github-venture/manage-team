import mongoose from 'mongoose';

const emailScheduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Schedule name is required'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['weekly_insights', 'monthly_report', 'custom'],
        default: 'weekly_insights'
    },
    cronSchedule: {
        type: String,
        required: [true, 'Cron schedule is required'],
        default: '0 9 * * 1' // Monday at 9 AM
    },
    teamIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    recipients: [{
        type: String,
        trim: true
    }],
    templateName: {
        type: String,
        trim: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    lastRun: {
        type: Date
    },
    nextRun: {
        type: Date
    },
    lastStatus: {
        type: String,
        enum: ['success', 'failure', 'pending'],
        default: 'pending'
    },
    lastError: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
emailScheduleSchema.index({ enabled: 1 });
emailScheduleSchema.index({ nextRun: 1 });
emailScheduleSchema.index({ type: 1 });

// Transform output
emailScheduleSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const EmailSchedule = mongoose.model('EmailSchedule', emailScheduleSchema);

export default EmailSchedule;