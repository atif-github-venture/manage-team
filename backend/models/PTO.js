import mongoose from 'mongoose';

const ptoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User ID is required']
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team ID is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required']
    },
    type: {
        type: String,
        enum: ['vacation', 'sick', 'personal', 'other'],
        default: 'vacation'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    reason: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: {
        type: Date
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
ptoSchema.index({ userId: 1, startDate: 1 });
ptoSchema.index({ teamId: 1, startDate: 1 });
ptoSchema.index({ startDate: 1, endDate: 1 });
ptoSchema.index({ status: 1 });

// Validation: endDate must be after or equal to startDate
ptoSchema.pre('save', function(next) {
    if (this.endDate < this.startDate) {
        return next(new Error('End date must be after or equal to start date'));
    }
    next();
});

// Transform output
ptoSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const PTO = mongoose.models.PTO || mongoose.model('PTO', ptoSchema);

export default PTO;