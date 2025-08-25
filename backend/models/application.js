const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: {
        type: String,
        enum: ['interested', 'registered', 'attended'],
        default: 'interested'
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);