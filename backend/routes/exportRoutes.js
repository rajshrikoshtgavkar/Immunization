const express = require('express');
const router = express.Router();
const { exportVaccineReport } = require('../controllers/exportController');
const { protect, authorize } = require('../middleware/auth');

// Admin only - Export vaccine report
router.get('/vaccine/:vaccineId/export', protect, authorize('admin'), exportVaccineReport);

module.exports = router;
