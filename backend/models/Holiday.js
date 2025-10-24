import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({
    holidayName: {
        type: String,
        required: [true, 'Holiday name is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Holiday date is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        enum: ['US', 'India', 'Global'],
        default: 'US'
    },
    year: {
        type: Number,
        required: true
    },
    hours: {
        type: Number,
        required: true,
        default: 8,
        min: [1, 'Hours must be at least 1'],
        max: [8, 'Hours cannot exceed 8']
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true
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
holidaySchema.index({ location: 1, year: 1 });
holidaySchema.index({ date: 1 });
holidaySchema.index({ location: 1, date: 1 });

// Pre-save to extract year
holidaySchema.pre('save', function(next) {
    if (this.date) {
        this.year = this.date.getFullYear();
    }
    next();
});

// Transform output
holidaySchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

const Holiday = mongoose.models.Holiday || mongoose.model('Holiday', holidaySchema);

export default Holiday;