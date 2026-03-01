const mongoose = require('mongoose');

const childHealthAssessmentSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0.5, 'Weight must be at least 0.5 kg']
  },
  height: {
    type: Number,
    required: [true, 'Height is required'],
    min: [30, 'Height must be at least 30 cm']
  },
  bmi: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Underweight', 'Normal', 'Overweight'],
    required: true
  },
  ageInMonths: {
    type: Number,
    required: true
  },
  suggestions: [{
    type: String
  }],
  diseasePrecautions: [{
    type: String
  }],
  vitaminRecommendations: [{
    type: String
  }],
  hygieneAdvice: [{
    type: String
  }],
  missedVaccineWarnings: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChildHealthAssessment', childHealthAssessmentSchema);
