const express = require('express');
const router = express.Router();

// Mock event routes for now
router.get('/all', (req, res) => {
    res.json({
        success: true,
        events: []
    });
});

router.post('/create', (req, res) => {
    res.json({
        success: true,
        event: {
            ...req.body,
            _id: Date.now().toString(),
            status: 'upcoming',
            registeredCount: 0
        }
    });
});

module.exports = router;