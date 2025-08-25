const express = require("express");
const router = express.Router();

const { createEvent,registerEvent,allEvents,studentsInEvent} = require("../controllers/events");
const { auth } = require("../middleware/auth");  // 👈 fix here

router.post("/createEvent", auth, createEvent);
router.post("/registerEvent", registerEvent);
router.get("/allevents", allEvents);
router.get("/studentsInEvent",studentsInEvent);

module.exports = router;
