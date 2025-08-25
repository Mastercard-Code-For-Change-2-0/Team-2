const express = require('express');
const router = express.Router();
const { loginAdmin, signupAdmin } = require('../controllers/user');

// Authentication routes
router.post('/loginAdmin', loginAdmin);
router.post('/signupAdmin', signupAdmin);

module.exports = router;