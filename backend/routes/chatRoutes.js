const express = require('express');
const router = express.Router();
const { askQuestion, getChatHistory, setLanguagePreference, getLanguagePreference } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/ask', protect, askQuestion);
router.get('/history', protect, getChatHistory);
router.post('/set-language', protect, setLanguagePreference);
router.get('/get-language', protect, getLanguagePreference);

module.exports = router;
