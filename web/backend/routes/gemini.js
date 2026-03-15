const express = require('express');
const router  = express.Router();
const { geminiChat } = require('../controllers/geminiController');

// Public route — rate limited at server level
router.post('/chat', geminiChat);

module.exports = router;
