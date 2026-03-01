const express = require('express');
const { getVaccineInventory, updateVaccineStock, getStockAlerts } = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getVaccineInventory);
router.get('/alerts', getStockAlerts);
router.put('/:vaccineId', updateVaccineStock);

module.exports = router;
