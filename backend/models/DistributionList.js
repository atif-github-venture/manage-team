import mongoose from 'mongoose';

const distributionListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    purpose: {
        type: String,
        required: true,
        trim: true
    },
    emails: [{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Invalid email format'
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes
distributionListSchema.index({ name: 1 });
distributionListSchema.index({ status: 1 });
distributionListSchema.index({ teamId: 1 });

export default mongoose.model('DistributionList', distributionListSchema);