const SMSLog = require('../models/SMSLog');
const { sendVaccinationReminder } = require('../utils/smsService');
const Child = require('../models/Child');
const VaccinationRecord = require('../models/VaccinationRecord');
const User = require('../models/User');

// @desc    Get SMS logs
// @route   GET /api/admin/sms-logs
// @access  Admin
exports.getSMSLogs = async (req, res) => {
  try {
    const { status, messageType, startDate, endDate } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (messageType) filter.messageType = messageType;
    if (startDate || endDate) {
      filter.sentAt = {};
      if (startDate) filter.sentAt.$gte = new Date(startDate);
      if (endDate) filter.sentAt.$lte = new Date(endDate);
    }

    const logs = await SMSLog.find(filter)
      .populate('child', 'name')
      .populate('vaccine', 'name')
      .sort('-sentAt')
      .limit(100);

    const summary = {
      total: await SMSLog.countDocuments(),
      sent: await SMSLog.countDocuments({ status: 'SENT' }),
      failed: await SMSLog.countDocuments({ status: 'FAILED' }),
      pending: await SMSLog.countDocuments({ status: 'PENDING' })
    };

    res.status(200).json({
      success: true,
      summary,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('SMS logs fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send vaccination reminders (manual trigger)
// @route   POST /api/admin/sms-logs/send-reminders
// @access  Admin
exports.sendVaccinationReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcomingRecords = await VaccinationRecord.find({
      status: 'UPCOMING',
      doseDate: {
        $gte: today,
        $lte: threeDaysFromNow
      }
    })
      .populate('child')
      .populate('vaccine');

    const results = [];
    
    for (const record of upcomingRecords) {
      const parent = await User.findById(record.child.parent);
      
      if (parent && parent.phone) {
        const result = await sendVaccinationReminder(
          parent,
          record.child,
          record.vaccine,
          record.doseDate
        );
        
        results.push({
          child: record.child.name,
          vaccine: record.vaccine.name,
          success: result.success
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Sent ${results.filter(r => r.success).length} reminders`,
      data: results
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
