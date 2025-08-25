const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    email: { type: String, required: true, unique: true },
    password:{ type: String, required: true },
    createdEventId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Foreign Key to Events
});

module.exports = mongoose.model('Admin', adminSchema);
