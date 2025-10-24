import mongoose from 'mongoose';

const jiraQuerySchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Team ID is required']
    },
    jqlKey: {
        type: String,
        required: [true, 'JQL key is required'],
        trim: true
    },
    jql: {
        type: String,
        required: [true, 'JQL query is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

// Compound index for teamId and jqlKey (unique per team)
jiraQuerySchema.index({ teamId: 1, jqlKey: 1 }, { unique: true });
jiraQuerySchema.index({ teamId: 1 });
jiraQuerySchema.index({ createdAt: -1 });

// Transform output
jiraQuerySchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const JiraQuery = mongoose.models.JiraQuery || mongoose.model('JiraQuery', jiraQuerySchema);

export default JiraQuery;