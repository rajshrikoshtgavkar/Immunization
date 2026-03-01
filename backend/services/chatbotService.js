const { getMedicineInfo, getDisclaimer } = require('./translationService');
const { generateGeminiResponse, isGeminiEnabled } = require('./geminiChatService');

// Generate chatbot response using Gemini AI
const generateResponse = async (question, context, language = 'en') => {
  const questionLower = question.toLowerCase();

  // Try Gemini AI first
  if (isGeminiEnabled()) {
    try {
      const geminiResult = await generateGeminiResponse(question, context, language);
      
      if (geminiResult.success) {
        return geminiResult.response;
      }
      
      console.log('Gemini AI failed, using fallback:', geminiResult.error);
    } catch (error) {
      console.error('Gemini AI service error:', error);
    }
  }

  // Fallback responses
  if (questionLower.includes('medicine') || questionLower.includes('दवा') || questionLower.includes('औषध')) {
    if (context.medicines && context.medicines.length > 0) {
      const medicineList = context.medicines.map(m => m.name).join(', ');
      
      const responses = {
        en: `Based on the prescription, the medicines are: ${medicineList}. Would you like to know more about any specific medicine?`,
        hi: `नुस्खे के आधार पर, दवाएं हैं: ${medicineList}। क्या आप किसी विशिष्ट दवा के बारे में अधिक जानना चाहेंगे?`,
        mr: `प्रिस्क्रिप्शनच्या आधारे, औषधे आहेत: ${medicineList}. तुम्हाला कोणत्याही विशिष्ट औषधाबद्दल अधिक जाणून घ्यायचे आहे का?`
      };
      
      return responses[language] || responses.en;
    }
  }

  if (questionLower.includes('dosage') || questionLower.includes('dose') || questionLower.includes('खुराक') || questionLower.includes('डोस')) {
    const responses = {
      en: 'Please follow the dosage instructions provided by your doctor. If you have concerns, consult your healthcare provider.',
      hi: 'कृपया अपने डॉक्टर द्वारा दी गई खुराक के निर्देशों का पालन करें। यदि आपको चिंता है, तो अपने स्वास्थ्य सेवा प्रदाता से परामर्श लें।',
      mr: 'कृपया तुमच्या डॉक्टरांनी दिलेल्या डोसच्या सूचनांचे पालन करा. तुम्हाला काळजी असल्यास, तुमच्या आरोग्य सेवा प्रदात्याशी सल्लामसलत करा.'
    };
    
    return responses[language] || responses.en;
  }

  if (questionLower.includes('side effect') || questionLower.includes('दुष्प्रभाव') || questionLower.includes('दुष्परिणाम')) {
    const responses = {
      en: 'Common side effects vary by medicine. If you experience severe side effects, contact your doctor immediately.',
      hi: 'सामान्य दुष्प्रभाव दवा के अनुसार भिन्न होते हैं। यदि आप गंभीर दुष्प्रभाव का अनुभव करते हैं, तो तुरंत अपने डॉक्टर से संपर्क करें।',
      mr: 'सामान्य दुष्परिणाम औषधानुसार बदलतात. तुम्हाला गंभीर दुष्परिणाम जाणवल्यास, ताबडतोब तुमच्या डॉक्टरांशी संपर्क साधा.'
    };
    
    return responses[language] || responses.en;
  }

  const defaultResponses = {
    en: 'I can help you with vaccination information, schedules, and general health guidance. Please consult a doctor for medical advice. What would you like to know?',
    hi: 'मैं टीकाकरण की जानकारी, कार्यक्रम और सामान्य स्वास्थ्य मार्गदर्शन में आपकी मदद कर सकता हूं। चिकित्सा सलाह के लिए कृपया डॉक्टर से परामर्श लें। आप क्या जानना चाहेंगे?',
    mr: 'मी तुम्हाला लसीकरण माहिती, वेळापत्रक आणि सामान्य आरोग्य मार्गदर्शनात मदत करू शकतो. वैद्यकीय सल्ल्यासाठी कृपया डॉक्टरांचा सल्ला घ्या. तुम्हाला काय जाणून घ्यायचे आहे?'
  };

  return defaultResponses[language] || defaultResponses.en;
};

module.exports = {
  generateResponse
};
