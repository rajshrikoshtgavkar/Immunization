const express = require('express');
const { getParentChildren, getParentAlerts, markAlertAsRead, getChildVaccinationSchedule } = require('../controllers/parentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are parent-only
router.use(protect, authorize('parent'));

router.get('/children', getParentChildren);
router.get('/alerts', getParentAlerts);
router.patch('/alerts/:id/read', markAlertAsRead);
router.get('/vaccinations/:childId', getChildVaccinationSchedule);

module.exports = router;
