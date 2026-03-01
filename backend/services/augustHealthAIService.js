const axios = require('axios');

// Medical safety prompts for different languages
const systemPrompts = {
  en: `You are a pediatric health information assistant for a child immunization system.
CRITICAL RULES:
- You must NOT diagnose diseases or medical conditions
- Provide only general health information and guidance
- Always encourage consulting a qualified doctor for medical decisions
- Use simple, clear language suitable for parents
- Focus on preventive care and general wellness
- If asked about serious symptoms, advise immediate medical consultation
- Include warning signs when relevant
- Be empathetic and supportive

Your responses should be informative but never replace professional medical advice.`,

  hi: `आप एक बाल टीकाकरण प्रणाली के लिए बाल चिकित्सा स्वास्थ्य सूचना सहायक हैं।
महत्वपूर्ण नियम:
- आपको बीमारियों या चिकित्सा स्थितियों का निदान नहीं करना चाहिए
- केवल सामान्य स्वास्थ्य जानकारी और मार्गदर्शन प्रदान करें
- हमेशा चिकित्सा निर्णयों के लिए योग्य डॉक्टर से परामर्श लेने के लिए प्रोत्साहित करें
- माता-पिता के लिए उपयुक्त सरल, स्पष्ट भाषा का उपयोग करें`,

  mr: `तुम्ही बाल लसीकरण प्रणालीसाठी बालरोग आरोग्य माहिती सहाय्यक आहात।
महत्त्वाचे नियम:
- तुम्ही रोग किंवा वैद्यकीय स्थितींचे निदान करू नये
- फक्त सामान्य आरोग्य माहिती आणि मार्गदर्शन प्रदान करा
- वैद्यकीय निर्णयांसाठी नेहमी पात्र डॉक्टरांचा सल्ला घेण्यास प्रोत्साहित करा`
};

// Check if August Health AI is enabled
const isAugustHealthEnabled = () => {
  const enabled = process.env.AUGUST_HEALTH_ENABLED === 'true';
  const apiKey = process.env.AUGUST_HEALTH_API_KEY;
  
  if (!enabled || !apiKey || apiKey.length < 20) {
    return false;
  }
  
  return true;
};

// Call August Health AI API
const getAugustHealthResponse = async (question, language = 'en', context = {}) => {
  try {
    const AUGUST_HEALTH_API_KEY = process.env.AUGUST_HEALTH_API_KEY;
    const AUGUST_HEALTH_API_URL = process.env.AUGUST_HEALTH_API_URL || 'https://api.augusthealth.ai/v1/chat';
    const AUGUST_HEALTH_TIMEOUT = parseInt(process.env.AUGUST_HEALTH_TIMEOUT) || 10000;

    // Build context-aware prompt
    let prompt = `${systemPrompts[language] || systemPrompts.en}\n\nUser Question: ${question}`;
    
    if (context.childAge) {
      prompt += `\n\nChild Age: ${context.childAge} months`;
    }
    
    if (context.medicines && context.medicines.length > 0) {
      prompt += `\n\nPrescribed Medicines: ${context.medicines.map(m => m.name).join(', ')}`;
    }

    // Language instruction
    const languageMap = {
      en: 'Respond in English.',
      hi: 'हिंदी में जवाब दें।',
      mr: 'मराठीत उत्तर द्या।'
    };
    prompt += `\n\n${languageMap[language] || languageMap.en}`;

    const response = await axios.post(
      AUGUST_HEALTH_API_URL,
      {
        prompt: prompt,
        language: language,
        context: {
          domain: 'pediatric_immunization',
          childAge: context.childAge,
          medicines: context.medicines?.map(m => m.name)
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${AUGUST_HEALTH_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: AUGUST_HEALTH_TIMEOUT
      }
    );

    if (response.data && response.data.response) {
      return {
        success: true,
        response: response.data.response,
        source: 'august_health'
      };
    }

    return {
      success: false,
      error: 'Invalid August Health AI response format'
    };

  } catch (error) {
    const errorCode = error.response?.data?.error?.code;
    const errorMessage = error.response?.data?.error?.message || error.message;
    
    console.error('August Health AI Error:', {
      code: errorCode,
      message: errorMessage
    });
    
    let userFriendlyError = 'August Health AI service unavailable. Using fallback responses.';
    
    if (errorCode === 'invalid_api_key') {
      userFriendlyError = 'August Health AI authentication failed. Using fallback responses.';
    } else if (errorCode === 'rate_limit_exceeded') {
      userFriendlyError = 'August Health AI rate limit exceeded. Please try again later.';
    }
    
    return {
      success: false,
      error: userFriendlyError,
      source: 'august_health_error'
    };
  }
};

// Fallback responses when AI fails
const getFallbackResponse = (language = 'en') => {
  const fallbacks = {
    en: 'I apologize, but I am unable to provide a detailed response at the moment. For medical concerns, please consult with a qualified healthcare provider. If this is an emergency, please seek immediate medical attention.',
    hi: 'मुझे खेद है, लेकिन मैं इस समय विस्तृत उत्तर प्रदान करने में असमर्थ हूं। चिकित्सा संबंधी चिंताओं के लिए, कृपया एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श लें। यदि यह आपातकाल है, तो कृपया तुरंत चिकित्सा सहायता लें।',
    mr: 'मला माफ करा, परंतु मी सध्या तपशीलवार प्रतिसाद देण्यास असमर्थ आहे. वैद्यकीय चिंतेसाठी, कृपया पात्र आरोग्य सेवा प्रदात्याशी सल्लामसलत करा. जर ही आणीबाणी असेल तर कृपया त्वरित वैद्यकीय मदत घ्या.'
  };

  return fallbacks[language] || fallbacks.en;
};

module.exports = {
  isAugustHealthEnabled,
  getAugustHealthResponse,
  getFallbackResponse
};
