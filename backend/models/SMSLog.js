const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  maskedNumber: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['VACCINATION_REMINDER', 'ELIGIBILITY_ALERT', 'DOSE_COMPLETION', 'LOW_STOCK_ALERT'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SENT', 'FAILED', 'PENDING'],
    default: 'PENDING'
  },
  errorMessage: {
    type: String
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine'
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

smsLogSchema.index({ sentAt: -1 });
smsLogSchema.index({ status: 1 });

module.exports = mongoose.model('SMSLog', smsLogSchema);
