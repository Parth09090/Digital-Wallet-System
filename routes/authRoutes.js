const express = require('express');
const router = express.Router();
const { register, login ,health } = require('../controllers/authController');

//health-checckup route
router.get('/health',health);
// Register
router.post('/register', register);

// Login
router.post('/login', login);

module.exports = router;
