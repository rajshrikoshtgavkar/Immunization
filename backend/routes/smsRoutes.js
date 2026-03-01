const express = require('express');
const { getSMSLogs, sendVaccinationReminders } = require('../controllers/smsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getSMSLogs);
router.post('/send-reminders', sendVaccinationReminders);

module.exports = router;
