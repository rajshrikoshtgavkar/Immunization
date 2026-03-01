const express = require('express');
const router = express.Router();
const { analyzeHealth, getHealthHistory } = require('../controllers/healthController');
const { protect } = require('../middleware/auth');

router.post('/analyze/:childId', protect, analyzeHealth);
router.get('/history/:childId', protect, getHealthHistory);

module.exports = router;
