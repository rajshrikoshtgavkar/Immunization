const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add vaccine name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add description']
  },
  totalDoses: {
    type: Number,
    required: [true, 'Please add total doses'],
    min: 1
  },
  gapBetweenDoses: {
    type: Number,
    required: [true, 'Please add gap between doses'],
    min: 0
  },
  minAgeValue: {
    type: Number,
    required: [true, 'Please add minimum age value'],
    min: 0
  },
  minAgeUnit: {
    type: String,
    enum: ['days', 'weeks', 'months', 'years'],
    required: [true, 'Please add age unit']
  },
  manufacturer: {
    type: String,
    default: ''
  },
  doseType: {
    type: String,
    enum: ['Single', 'Multiple'],
    default: 'Multiple'
  },
  expiryDate: {
    type: Date
  },
  totalStock: {
    type: Number,
    default: 0,
    min: 0
  },
  minStockThreshold: {
    type: Number,
    default: 50,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

vaccineSchema.virtual('usedStock').get(function() {
  return this._usedStock || 0;
});

vaccineSchema.virtual('remainingStock').get(function() {
  return this.totalStock - (this._usedStock || 0);
});

vaccineSchema.set('toJSON', { virtuals: true });
vaccineSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vaccine', vaccineSchema);
