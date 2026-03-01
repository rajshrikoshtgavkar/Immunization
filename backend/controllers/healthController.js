const Child = require('../models/Child');
const ChildHealthAssessment = require('../models/ChildHealthAssessment');
const { analyzeChildHealth } = require('../services/healthAdvisorService');

// @desc    Analyze child health and generate advisory
// @route   POST /api/health/analyze/:childId
// @access  Protected (Parent/Admin)
exports.analyzeHealth = async (req, res) => {
  try {
    const { weight, height } = req.body;
    const { childId } = req.params;

    if (!weight || !height) {
      return res.status(400).json({ success: false, message: 'Please provide weight and height' });
    }

    const child = await Child.findById(childId).populate('parent');
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    // Authorization: Parent can only access their own children
    if (req.user.role === 'parent' && child.parent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this child' });
    }

    const analysis = await analyzeChildHealth(child, weight, height);

    const assessment = await ChildHealthAssessment.create({
      child: childId,
      weight,
      height,
      bmi: analysis.bmi,
      category: analysis.category,
      ageInMonths: analysis.ageInMonths,
      suggestions: analysis.suggestions,
      diseasePrecautions: analysis.diseasePrecautions,
      vitaminRecommendations: analysis.vitaminRecommendations,
      hygieneAdvice: analysis.hygieneAdvice,
      missedVaccineWarnings: analysis.missedVaccineWarnings
    });

    res.status(201).json({
      success: true,
      data: {
        assessment,
        disclaimer: 'This is an advisory system. Please consult a pediatrician for medical decisions.'
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get health assessment history for a child
// @route   GET /api/health/history/:childId
// @access  Protected (Parent/Admin)
exports.getHealthHistory = async (req, res) => {
  try {
    const { childId } = req.params;

    const child = await Child.findById(childId).populate('parent');
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    // Authorization: Parent can only access their own children
    if (req.user.role === 'parent' && child.parent._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this child' });
    }

    const assessments = await ChildHealthAssessment.find({ child: childId })
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
