const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPrescription, getPrescription, getMyPrescriptions } = require('../controllers/prescriptionController');
const { protect } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/prescriptions/');
  },
  filename: function (req, file, cb) {
    cb(null, `prescription-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG) or PDF are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

router.post('/upload', protect, upload.single('prescription'), uploadPrescription);
router.get('/my-prescriptions', protect, getMyPrescriptions);
router.get('/:id', protect, getPrescription);

module.exports = router;
