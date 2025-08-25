const Event = require('../models/event');


exports.createEvent = async (req, res) => {
    try {
        const adminId = req.user.id; 
        const { eventName, eventType, eventDate, location, status } = req.body;

        const event = new Event({
            eventName,
            eventType,
            eventDate,
            location,
            status,
            createdBy: adminId
        });

        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
};


exports.getAdminEvents = async (req, res) => {
    try {
        const adminId = req.user.id; 

        const events = await Event.find({ createdBy: adminId });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events',
            error: error.message
        });
    }
};