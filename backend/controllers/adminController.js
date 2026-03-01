const User = require('../models/User');
const Child = require('../models/Child');
const Vaccine = require('../models/Vaccine');
const Alert = require('../models/Alert');
const VaccinationRecord = require('../models/VaccinationRecord');
const { isEligible } = require('../utils/eligibility');
const { sendDoseCompletion } = require('../utils/smsService');

// @desc    Create parent user
// @route   POST /api/admin/parents
// @access  Admin
exports.createParent = async (req, res) => {
  try {
    const { name, email, password, phone, aadhaarNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Parent already exists' });
    }

    const parent = await User.create({ name, email, password, phone, aadhaarNumber, role: 'parent' });

    res.status(201).json({
      success: true,
      data: {
        _id: parent._id,
        name: parent.name,
        email: parent.email,
        phone: parent.phone,
        maskedAadhaar: parent.getMaskedAadhaar(),
        role: parent.role
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all parents
// @route   GET /api/admin/parents
// @access  Admin
exports.getParents = async (req, res) => {
  try {
    const parents = await User.find({ role: 'parent' }).select('-password').sort('-createdAt');
    
    const parentsWithChildCount = await Promise.all(
      parents.map(async (parent) => {
        const childCount = await Child.countDocuments({ parent: parent._id });
        return {
          ...parent.toObject(),
          childCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: parentsWithChildCount.length,
      data: parentsWithChildCount
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get parent with children
// @route   GET /api/admin/parents/:id
// @access  Admin
exports.getParentById = async (req, res) => {
  try {
    const parent = await User.findById(req.params.id).select('-password');
    
    if (!parent || parent.role !== 'parent') {
      return res.status(404).json({ success: false, message: 'Parent not found' });
    }

    const children = await Child.find({ parent: parent._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        parent,
        children
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add child
// @route   POST /api/admin/children
// @access  Admin
exports.addChild = async (req, res) => {
  try {
    const { name, dateOfBirth, gender, parent } = req.body;

    const parentUser = await User.findById(parent);
    if (!parentUser || parentUser.role !== 'parent') {
      return res.status(404).json({ success: false, message: 'Parent not found' });
    }

    const child = await Child.create({ name, dateOfBirth, gender, parent });

    res.status(201).json({
      success: true,
      data: child
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update child
// @route   PUT /api/admin/children/:id
// @access  Admin
exports.updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    res.status(200).json({
      success: true,
      data: child
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete child
// @route   DELETE /api/admin/children/:id
// @access  Admin
exports.deleteChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);

    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Child deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create vaccine
// @route   POST /api/admin/vaccines
// @access  Admin
exports.createVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.create(req.body);
    res.status(201).json({ success: true, data: vaccine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all vaccines
// @route   GET /api/admin/vaccines
// @access  Admin
exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.find().sort('-createdAt');
    res.status(200).json({ success: true, count: vaccines.length, data: vaccines });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update vaccine
// @route   PUT /api/admin/vaccines/:id
// @access  Admin
exports.updateVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }
    res.status(200).json({ success: true, data: vaccine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete vaccine (soft delete)
// @route   DELETE /api/admin/vaccines/:id
// @access  Admin
exports.deleteVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }
    res.status(200).json({ success: true, message: 'Vaccine deactivated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get eligible vaccines for child
// @route   GET /api/admin/eligible-vaccines/:childId
// @access  Admin
exports.getEligibleVaccines = async (req, res) => {
  try {
    const child = await Child.findById(req.params.childId);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    const vaccines = await Vaccine.find({ isActive: true });
    const vaccinesWithEligibility = vaccines.map(vaccine => ({
      ...vaccine.toObject(),
      eligible: isEligible(child.dateOfBirth, vaccine)
    }));

    res.status(200).json({ success: true, data: { child, vaccines: vaccinesWithEligibility } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create alert
// @route   POST /api/admin/alerts
// @access  Admin
exports.createAlert = async (req, res) => {
  try {
    const { title, message, vaccineId } = req.body;

    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }

    const allChildren = await Child.find();
    const eligibleChildren = allChildren.filter(child => isEligible(child.dateOfBirth, vaccine));

    const alert = await Alert.create({
      title,
      message,
      vaccine: vaccineId,
      eligibleChildren: eligibleChildren.map(c => c._id),
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: alert, eligibleCount: eligibleChildren.length });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all alerts
// @route   GET /api/admin/alerts
// @access  Admin
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('vaccine').sort('-createdAt');
    res.status(200).json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get alert by ID
// @route   GET /api/admin/alerts/:id
// @access  Admin
exports.getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('vaccine').populate('eligibleChildren');
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Preview eligible children for vaccine
// @route   GET /api/admin/alerts/preview/:vaccineId
// @access  Admin
exports.previewEligibleChildren = async (req, res) => {
  try {
    const vaccine = await Vaccine.findById(req.params.vaccineId);
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }

    const allChildren = await Child.find().populate('parent', 'name email');
    const eligibleChildren = allChildren.filter(child => isEligible(child.dateOfBirth, vaccine));

    res.status(200).json({ success: true, count: eligibleChildren.length, data: eligibleChildren });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Record first dose and auto-generate schedule
// @route   POST /api/admin/vaccinations/first-dose
// @access  Admin
exports.recordFirstDose = async (req, res) => {
  try {
    const { childId, vaccineId, doseDate } = req.body;

    const child = await Child.findById(childId).populate('parent');
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }

    const existingSchedule = await VaccinationRecord.findOne({ child: childId, vaccine: vaccineId });
    if (existingSchedule) {
      return res.status(400).json({ success: false, message: 'Schedule already exists for this vaccine' });
    }

    const records = [];
    for (let i = 1; i <= vaccine.totalDoses; i++) {
      const date = new Date(doseDate);
      date.setDate(date.getDate() + (i - 1) * vaccine.gapBetweenDoses);

      records.push({
        child: childId,
        vaccine: vaccineId,
        doseNumber: i,
        doseDate: date,
        status: i === 1 ? 'TAKEN' : 'UPCOMING'
      });
    }

    await VaccinationRecord.insertMany(records);

    // Send SMS confirmation for first dose
    if (child.parent && child.parent.phone) {
      await sendDoseCompletion(child.parent, child, vaccine, 1);
    }

    res.status(201).json({ success: true, data: records });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get vaccination schedule for child
// @route   GET /api/admin/vaccinations/:childId
// @access  Admin
exports.getVaccinationSchedule = async (req, res) => {
  try {
    const records = await VaccinationRecord.find({ child: req.params.childId })
      .populate('vaccine')
      .populate('child')
      .sort('doseDate');

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get overall vaccination report
// @route   GET /api/admin/reports/overall
// @access  Admin
exports.getOverallReport = async (req, res) => {
  try {
    const totalChildren = await Child.countDocuments();
    
    const allRecords = await VaccinationRecord.find();
    const today = new Date();
    
    const totalDosesTaken = allRecords.filter(r => r.status === 'TAKEN').length;
    const totalDosesMissed = allRecords.filter(r => r.status === 'UPCOMING' && new Date(r.doseDate) < today).length;

    res.status(200).json({
      success: true,
      data: {
        totalChildren,
        totalDosesTaken,
        totalDosesMissed
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get vaccine-wise report
// @route   GET /api/admin/reports/vaccine-wise
// @access  Admin
exports.getVaccineWiseReport = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ isActive: true });
    const today = new Date();
    
    const report = await Promise.all(
      vaccines.map(async (vaccine) => {
        const records = await VaccinationRecord.find({ vaccine: vaccine._id });
        
        const dosesTaken = records.filter(r => r.status === 'TAKEN').length;
        const dosesMissed = records.filter(r => r.status === 'UPCOMING' && new Date(r.doseDate) < today).length;
        
        return {
          vaccineName: vaccine.name,
          dosesTaken,
          dosesMissed
        };
      })
    );

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
