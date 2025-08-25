const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    year: { type: Number, required: true },
    fieldOfStudy: { type: String, required: true },
    registeredEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Foreign Key to Events
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
