const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getSystemStats } = require('../controllers/adminController');

// Admin only route
router.get('/stats', protect, admin, getSystemStats);

module.exports = router;
