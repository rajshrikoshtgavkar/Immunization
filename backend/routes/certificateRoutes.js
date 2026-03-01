const express = require('express');
const { getChildCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('parent'));

router.get('/child/:childId', getChildCertificate);

module.exports = router;
