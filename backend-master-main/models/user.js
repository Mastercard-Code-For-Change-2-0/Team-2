const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true},
    phone: { type: String },
    college: { type: String},
    year: { type: Number},
    password:{ type: String},
    fieldOfStudy: { type: String},
    registeredEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Foreign Key to Events
});

module.exports = mongoose.model('Student', studentSchema);
