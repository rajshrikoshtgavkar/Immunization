const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  },
  imagePath: {
    type: String,
    required: true
  },
  extractedText: {
    type: String
  },
  doctorName: String,
  prescriptionDate: Date,
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    explanation: {
      en: String,
      hi: String,
      mr: String
    },
    sideEffects: {
      en: [String],
      hi: [String],
      mr: [String]
    },
    precautions: {
      en: [String],
      hi: [String],
      mr: [String]
    }
  }],
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSED', 'FAILED'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
