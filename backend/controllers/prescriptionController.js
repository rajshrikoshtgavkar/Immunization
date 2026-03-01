const Prescription = require('../models/Prescription');
const { extractTextFromImage, parsePrescriptionText } = require('../services/ocrService');
const { getMedicineInfo } = require('../services/translationService');
const path = require('path');

// @desc    Upload and process prescription
// @route   POST /api/prescription/upload
// @access  Protected (Parent)
exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const { childId, language = 'en' } = req.body;

    // Create prescription record
    const prescription = await Prescription.create({
      user: req.user._id,
      child: childId || null,
      imagePath: req.file.path,
      status: 'PENDING'
    });

    // Process OCR in background
    try {
      const extractedText = await extractTextFromImage(req.file.path);
      const parsedData = parsePrescriptionText(extractedText);

      // Enrich medicines with AI explanations
      const enrichedMedicines = parsedData.medicines.map(medicine => {
        const info = getMedicineInfo(medicine.name, language);
        return {
          ...medicine,
          explanation: {
            en: info.usage,
            hi: getMedicineInfo(medicine.name, 'hi').usage,
            mr: getMedicineInfo(medicine.name, 'mr').usage
          },
          sideEffects: {
            en: info.sideEffects,
            hi: getMedicineInfo(medicine.name, 'hi').sideEffects,
            mr: getMedicineInfo(medicine.name, 'mr').sideEffects
          },
          precautions: {
            en: info.precautions,
            hi: getMedicineInfo(medicine.name, 'hi').precautions,
            mr: getMedicineInfo(medicine.name, 'mr').precautions
          }
        };
      });

      prescription.extractedText = extractedText;
      prescription.doctorName = parsedData.doctorName;
      prescription.prescriptionDate = parsedData.prescriptionDate;
      prescription.medicines = enrichedMedicines;
      prescription.status = 'PROCESSED';
      await prescription.save();

    } catch (error) {
      prescription.status = 'FAILED';
      await prescription.save();
      console.error('OCR Processing Error:', error);
    }

    res.status(201).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get prescription by ID
// @route   GET /api/prescription/:id
// @access  Protected (Parent/Admin)
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('user', 'name email')
      .populate('child', 'name dateOfBirth');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Authorization check
    if (req.user.role === 'parent' && prescription.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all prescriptions for user
// @route   GET /api/prescription/my-prescriptions
// @access  Protected (Parent)
exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id })
      .populate('child', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
