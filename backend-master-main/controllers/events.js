const express = require("express");
const Event = require("../models/event");
const Admin = require("../models/admin");
const Student = require("../models/user");

// Create Event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, time, detailedDescription, mapLink, type, targetAudience, createdBy } = req.body;
    
    console.log("Received event data:", req.body);

    if (!title || !description || !location || !date || !time || !detailedDescription || !type || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "All mandatory fields are required: title, description, location, date, time, detailedDescription, type, createdBy"
      });
    }

    // Combine date and time for the date field
    const eventDateTime = new Date(`${date}T${time}`);

    const event = await Event.create({
      title,
      description,
      location,
      createdBy,
      date: eventDateTime,
      time,
      detailedDescription,
      mapLink: mapLink || '',
      type,
      targetAudience: targetAudience || 'All',
    });

    await Admin.findByIdAndUpdate(
      createdBy,
      { $push: { createdEventId: event._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      event,
      message: "Event created successfully"
    });
  } catch (error) {
    console.log("Create Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



// Register student for an event
exports.registerEvent = async (req, res) => {
    try {
        const { eventId,name,email,phone,college,year,fieldOfStudy} = req.body;
        

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        const eve = await Event.findById(eventId)

        const student = await Student.create({
            name,email,phone,college,year,fieldOfStudy,registeredEventId:eve._id
        })

        const event = await Event.findByIdAndUpdate(
            eventId,
            { $push:{
                    studentsEnrolled:student._id
                } 
            },
            { new: true }
        )

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            student,
            event,
            message: "Successfully registered for event"
        });
    } catch (error) {
        console.error("Register Event Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// Get all events
exports.allEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("createdBy", "name email")
            .populate("studentsEnrolled", "name email")
            .populate("attendStudents", "name email");

        return res.status(200).json({
            success: true,
            count: events.length,
            events,
        });
    } catch (error) {
        console.error("All Events Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


// exports.adminEvents = async (req, res) => {
//     try {
//         const adminId = req.user._id;

//         const events = await Event.find({ createdBy: adminId })
//             .populate("studentsEnrolled", "name email")
//             .populate("attendedStudents", "name email");

//         return res.status(200).json({
//             success: true,
//             count: events.length,
//             events,
//         });
//     } catch (error) {
//         console.error("Admin Events Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };

exports.studentsInEvent = async(req,res) => {
    try{
        const {eventId} = req.body;

        const event = await Event.findById(eventId).populate("studentsEnrolled")
                                .exec();

        return res.status(200).json({
            success: true,
            message:"list of all students in event",
            event,
        });
    }
    catch (error) {
        console.error("Admin Events Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
