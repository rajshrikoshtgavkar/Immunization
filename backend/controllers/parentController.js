const Alert = require('../models/Alert');
const Child = require('../models/Child');
const VaccinationRecord = require('../models/VaccinationRecord');

// @desc    Get parent's children
// @route   GET /api/parent/children
// @access  Parent
exports.getParentChildren = async (req, res) => {
  try {
    const children = await Child.find({ parent: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: children.length, data: children });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get alerts for parent's children
// @route   GET /api/parent/alerts
// @access  Parent
exports.getParentAlerts = async (req, res) => {
  try {
    const myChildren = await Child.find({ parent: req.user._id });
    const myChildrenIds = myChildren.map(c => c._id.toString());

    const alerts = await Alert.find({
      isActive: true,
      eligibleChildren: { $in: myChildrenIds }
    })
      .populate('vaccine')
      .sort('-createdAt');

    const alertsWithChildren = alerts.map(alert => {
      const relevantChildren = myChildren.filter(child =>
        alert.eligibleChildren.some(id => id.toString() === child._id.toString())
      );
      
      const isRead = alert.readBy.some(r => r.parent.toString() === req.user._id.toString());

      return {
        ...alert.toObject(),
        children: relevantChildren,
        isRead
      };
    });

    res.status(200).json({ success: true, count: alertsWithChildren.length, data: alertsWithChildren });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Mark alert as read
// @route   PATCH /api/parent/alerts/:id/read
// @access  Parent
exports.markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    const alreadyRead = alert.readBy.some(r => r.parent.toString() === req.user._id.toString());
    if (!alreadyRead) {
      alert.readBy.push({ parent: req.user._id });
      await alert.save();
    }

    res.status(200).json({ success: true, message: 'Alert marked as read' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get vaccination schedule for parent's child
// @route   GET /api/parent/vaccinations/:childId
// @access  Parent
exports.getChildVaccinationSchedule = async (req, res) => {
  try {
    const child = await Child.findById(req.params.childId);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    if (child.parent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const records = await VaccinationRecord.find({ child: req.params.childId })
      .populate('vaccine')
      .populate('child')
      .sort('doseDate');

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
