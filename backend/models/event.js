const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, enum: ['Webinar', 'College Visit', 'Workshop', 'Social Media'], required: true },
    eventDate: { type: Date, default: Date.now },
    location: { type: String }, // e.g., "IIT Bombay" or "Online"
});

module.exports = mongoose.model('Event', eventSchema);
