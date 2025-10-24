import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team ID is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
        trim: true
    },
    jiraAccountId: {
        type: String,
        required: [true, 'Jira Account ID is required'],
        trim: true
    },
    jiraUsername: {
        type: String,
        trim: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    leaveDate: {
        type: Date
    },
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
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });
teamMemberSchema.index({ teamId: 1, active: 1 });
teamMemberSchema.index({ userId: 1 });
teamMemberSchema.index({ email: 1 });

// Transform output
teamMemberSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;