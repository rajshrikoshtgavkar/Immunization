const express = require('express');
const router = express.Router();
const { getNearbyCenters, getCenterDetails } = require('../controllers/centerController');
const { protect } = require('../middleware/auth');

router.get('/nearby', protect, getNearbyCenters);
router.get('/:placeId', protect, getCenterDetails);

module.exports = router;
