const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  vaccine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vaccine',
    required: true
  },
  doseNumber: {
    type: Number,
    required: true,
    min: 1
  },
  doseDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['TAKEN', 'UPCOMING'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VaccinationRecord', vaccinationRecordSchema);
