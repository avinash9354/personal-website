const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  sendMessage,
  getMessages,
  updateMessageStatus
} = require('../controllers/messageController');

// Public route
router.post('/', sendMessage);

// Admin only routes
router.get('/', protect, admin, getMessages);
router.put('/:id', protect, admin, updateMessageStatus);

module.exports = router;