const express = require('express');
const { register, login, linkAadhaar, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', protect, authorize('admin'), register);
router.post('/login', login);
router.post('/link-aadhaar', protect, authorize('parent'), linkAadhaar);
router.get('/me', protect, getMe);

module.exports = router;
