const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password:{ type: String, required: true },
    registeredEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Foreign Key to Events
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
