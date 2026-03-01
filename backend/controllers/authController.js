const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, aadhaarNumber } = req.body;

    // Determine login method
    let user;
    
    if (aadhaarNumber) {
      // Aadhaar-based login (for parents)
      if (!password) {
        return res.status(400).json({ success: false, message: 'Please provide Aadhaar number and password' });
      }

      // Normalize Aadhaar: remove dashes, spaces, and non-digits
      const normalizedAadhaar = aadhaarNumber.replace(/\D/g, '');

      if (!/^[0-9]{12}$/.test(normalizedAadhaar)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid 12-digit Aadhaar number' });
      }

      user = await User.findOne({ aadhaarNumber: normalizedAadhaar, role: 'parent' }).select('+password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid Aadhaar number or password' });
      }
    } else if (email) {
      // Email-based login (backward compatibility + admin)
      if (!password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
      }

      user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Please provide login credentials' });
    }

    // Verify password
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    // Check if parent needs to link Aadhaar
    const needsAadhaarLink = user.role === 'parent' && !user.aadhaarNumber;

    res.status(200).json({
      success: true,
      token,
      needsAadhaarLink,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        aadhaarLinked: !!user.aadhaarNumber,
        maskedAadhaar: user.getMaskedAadhaar()
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.linkAadhaar = async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber || !/^[0-9]{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 12-digit Aadhaar number' });
    }

    // Check if Aadhaar already exists
    const existingUser = await User.findOne({ aadhaarNumber });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'This Aadhaar number is already linked to another account' });
    }

    const user = await User.findById(req.user._id);
    user.aadhaarNumber = aadhaarNumber;
    user.aadhaarVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Aadhaar number linked successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        maskedAadhaar: user.getMaskedAadhaar(),
        aadhaarLinked: true
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      aadhaarLinked: !!user.aadhaarNumber,
      maskedAadhaar: user.getMaskedAadhaar()
    };

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
