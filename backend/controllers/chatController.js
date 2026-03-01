const ChatSession = require('../models/ChatSession');
const UserPreference = require('../models/UserPreference');
const Prescription = require('../models/Prescription');
const { generateResponse } = require('../services/chatbotService');
const { getDisclaimer } = require('../services/translationService');

// @desc    Ask AI chatbot a question
// @route   POST /api/chat/ask
// @access  Protected (Parent)
exports.askQuestion = async (req, res) => {
  try {
    const { question, language = 'en', prescriptionId, childId } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Please provide a question' });
    }

    // Get or create chat session
    let session = await ChatSession.findOne({
      user: req.user._id,
      'context.prescriptionId': prescriptionId || null
    }).sort('-createdAt');

    if (!session) {
      session = await ChatSession.create({
        user: req.user._id,
        language,
        messages: [],
        context: {
          prescriptionId: prescriptionId || null,
          childId: childId || null
        }
      });
    }

    // Get context from prescription if available
    let context = {};
    if (prescriptionId) {
      const prescription = await Prescription.findById(prescriptionId);
      if (prescription) {
        context.medicines = prescription.medicines;
      }
    }

    // Generate AI response
    const aiResponse = await generateResponse(question, context, language);

    // Add messages to session
    session.messages.push({
      role: 'user',
      content: question
    });

    session.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    session.language = language;
    await session.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer: aiResponse,
        disclaimer: getDisclaimer(language),
        sessionId: session._id
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Protected (Parent)
exports.getChatHistory = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Set user language preference
// @route   POST /api/chat/set-language
// @access  Protected (Parent)
exports.setLanguagePreference = async (req, res) => {
  try {
    const { language } = req.body;

    if (!['en', 'hi', 'mr'].includes(language)) {
      return res.status(400).json({ success: false, message: 'Invalid language' });
    }

    let preference = await UserPreference.findOne({ user: req.user._id });

    if (preference) {
      preference.language = language;
      preference.updatedAt = Date.now();
      await preference.save();
    } else {
      preference = await UserPreference.create({
        user: req.user._id,
        language
      });
    }

    res.status(200).json({
      success: true,
      data: preference
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get user language preference
// @route   GET /api/chat/get-language
// @access  Protected (Parent)
exports.getLanguagePreference = async (req, res) => {
  try {
    const preference = await UserPreference.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        language: preference ? preference.language : 'en'
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
