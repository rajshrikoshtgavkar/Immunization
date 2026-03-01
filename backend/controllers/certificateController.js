const Child = require('../models/Child');
const VaccinationRecord = require('../models/VaccinationRecord');
const User = require('../models/User');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// @desc    Get vaccination certificate for a child
// @route   GET /api/certificates/child/:childId
// @access  Parent
exports.getChildCertificate = async (req, res) => {
  try {
    const child = await Child.findById(req.params.childId).populate('parent');
    
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    if (child.parent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const completedRecords = await VaccinationRecord.find({ 
      child: req.params.childId,
      status: 'TAKEN'
    }).populate('vaccine').sort('doseDate');

    if (completedRecords.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No completed vaccinations found for this child' 
      });
    }

    const certificateId = uuidv4();
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-certificate/${certificateId}`;
    
    const qrData = JSON.stringify({
      certificateId,
      childId: child._id,
      verificationUrl
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const certificateData = {
      certificateId,
      issueDate: new Date(),
      issuedBy: 'e-Immunization System',
      child: {
        id: child._id,
        name: child.name,
        dateOfBirth: child.dateOfBirth,
        gender: child.gender
      },
      parent: {
        name: child.parent.name,
        email: child.parent.email
      },
      vaccinations: completedRecords.map(record => ({
        vaccineName: record.vaccine.name,
        doseNumber: record.doseNumber,
        dateOfVaccination: record.doseDate,
        status: record.status
      })),
      qrCode: qrCodeDataUrl,
      verificationUrl
    };

    res.status(200).json({ success: true, data: certificateData });
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
