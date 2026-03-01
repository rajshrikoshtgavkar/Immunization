const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: {
    type: String,
    trim: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  aadhaarNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^[0-9]{12}$/.test(v);
      },
      message: 'Aadhaar number must be 12 digits'
    }
  },
  aadhaarVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'parent'],
    default: 'parent'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  // Normalize Aadhaar before saving
  if (this.isModified('aadhaarNumber') && this.aadhaarNumber) {
    this.aadhaarNumber = this.aadhaarNumber.replace(/\D/g, '');
  }
  
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getMaskedAadhaar = function() {
  if (!this.aadhaarNumber) return null;
  return 'XXXX-XXXX-' + this.aadhaarNumber.slice(-4);
};

module.exports = mongoose.model('User', userSchema);
