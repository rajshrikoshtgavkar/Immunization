const express = require('express');
const {
  createParent,
  getParents,
  getParentById,
  addChild,
  updateChild,
  deleteChild,
  createVaccine,
  getVaccines,
  updateVaccine,
  deleteVaccine,
  getEligibleVaccines,
  createAlert,
  getAlerts,
  getAlertById,
  previewEligibleChildren,
  recordFirstDose,
  getVaccinationSchedule,
  getOverallReport,
  getVaccineWiseReport
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are admin-only
router.use(protect, authorize('admin'));

// Parent routes
router.post('/parents', createParent);
router.get('/parents', getParents);
router.get('/parents/:id', getParentById);

// Child routes
router.post('/children', addChild);
router.put('/children/:id', updateChild);
router.delete('/children/:id', deleteChild);

// Vaccine routes
router.post('/vaccines', createVaccine);
router.get('/vaccines', getVaccines);
router.put('/vaccines/:id', updateVaccine);
router.delete('/vaccines/:id', deleteVaccine);

// Eligibility route
router.get('/eligible-vaccines/:childId', getEligibleVaccines);

// Alert routes
router.post('/alerts', createAlert);
router.get('/alerts', getAlerts);
router.get('/alerts/:id', getAlertById);
router.get('/alerts/preview/:vaccineId', previewEligibleChildren);

// Vaccination record routes
router.post('/vaccinations/first-dose', recordFirstDose);
router.get('/vaccinations/:childId', getVaccinationSchedule);

// Report routes
router.get('/reports/overall', getOverallReport);
router.get('/reports/vaccine-wise', getVaccineWiseReport);

module.exports = router;
