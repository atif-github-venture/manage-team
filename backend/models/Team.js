import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    jiraAccountId: {
        type: String,
        required: true,
        trim: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

const teamSchema = new mongoose.Schema({
    teamId: {
        type: String,
        required: [true, 'Team ID is required'],
        unique: true,
        trim: true
    },
    teamName: {
        type: String,
        required: [true, 'Team name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    jiraProject: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        enum: ['US', 'India', 'Global'],
        default: 'US',
        required: true
    },
    members: [teamMemberSchema],
    active: {
        type: Boolean,
        default: true
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
teamSchema.index({ teamId: 1 });
teamSchema.index({ teamName: 1 });
teamSchema.index({ active: 1 });

// Transform output
teamSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default Team;