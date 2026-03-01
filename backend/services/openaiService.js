const axios = require('axios');

// System prompts for different languages
const systemPrompts = {
  en: `You are a medical information assistant for a child immunization system.
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

  hi: `आप एक बाल टीकाकरण प्रणाली के लिए चिकित्सा सूचना सहायक हैं।
महत्वपूर्ण नियम:
- आपको बीमारियों या चिकित्सा स्थितियों का निदान नहीं करना चाहिए
- केवल सामान्य स्वास्थ्य जानकारी और मार्गदर्शन प्रदान करें
- हमेशा चिकित्सा निर्णयों के लिए योग्य डॉक्टर से परामर्श लेने के लिए प्रोत्साहित करें
- माता-पिता के लिए उपयुक्त सरल, स्पष्ट भाषा का उपयोग करें
- निवारक देखभाल और सामान्य कल्याण पर ध्यान दें
- गंभीर लक्षणों के बारे में पूछे जाने पर तत्काल चिकित्सा परामर्श की सलाह दें

आपकी प्रतिक्रियाएं सूचनात्मक होनी चाहिए लेकिन कभी भी पेशेवर चिकित्सा सलाह की जगह नहीं लेनी चाहिए।`,

  mr: `तुम्ही बाल लसीकरण प्रणालीसाठी वैद्यकीय माहिती सहाय्यक आहात।
महत्त्वाचे नियम:
- तुम्ही रोग किंवा वैद्यकीय स्थितींचे निदान करू नये
- फक्त सामान्य आरोग्य माहिती आणि मार्गदर्शन प्रदान करा
- वैद्यकीय निर्णयांसाठी नेहमी पात्र डॉक्टरांचा सल्ला घेण्यास प्रोत्साहित करा
- पालकांसाठी योग्य सोपी, स्पष्ट भाषा वापरा
- प्रतिबंधात्मक काळजी आणि सामान्य कल्याणावर लक्ष केंद्रित करा
- गंभीर लक्षणांबद्दल विचारल्यास त्वरित वैद्यकीय सल्ला घेण्याचा सल्ला द्या

तुमचे प्रतिसाद माहितीपूर्ण असावेत परंतु कधीही व्यावसायिक वैद्यकीय सल्ल्याची जागा घेऊ नयेत।`
};

// Check if query should use OpenAI
const shouldUseOpenAI = (question) => {
  const OPENAI_ENABLED = process.env.OPENAI_ENABLED === 'true';
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_ENABLED || !OPENAI_API_KEY) {
    return false;
  }
  
  if (OPENAI_API_KEY.includes('your_openai_api_key_here') || OPENAI_API_KEY.length < 20) {
    return false;
  }

  return true;
};

// Call OpenAI API with medical safety
const getOpenAIResponse = async (question, language = 'en', context = {}) => {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS) || 500;
    const OPENAI_TIMEOUT = parseInt(process.env.OPENAI_TIMEOUT) || 10000;

    let userMessage = question;
    
    if (context.childAge) {
      userMessage += `\n\nContext: Child age is ${context.childAge} months.`;
    }
    
    if (context.medicines && context.medicines.length > 0) {
      userMessage += `\n\nPrescribed medicines: ${context.medicines.map(m => m.name).join(', ')}`;
    }

    const languageInstruction = {
      en: '\n\nRespond in English.',
      hi: '\n\nहिंदी में जवाब दें।',
      mr: '\n\nमराठीत उत्तर द्या।'
    };

    userMessage += languageInstruction[language] || languageInstruction.en;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompts[language] || systemPrompts.en
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: OPENAI_TIMEOUT
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return {
        success: true,
        response: response.data.choices[0].message.content.trim(),
        source: 'openai'
      };
    }

    return {
      success: false,
      error: 'Invalid OpenAI response format'
    };

  } catch (error) {
    const errorCode = error.response?.data?.error?.code;
    const errorType = error.response?.data?.error?.type;
    const errorMessage = error.response?.data?.error?.message || error.message;
    
    console.error('OpenAI API Error:', {
      code: errorCode,
      type: errorType,
      message: errorMessage
    });
    
    // Handle specific error types
    let userFriendlyError = errorMessage;
    
    if (errorCode === 'invalid_api_key' || errorType === 'invalid_request_error') {
      userFriendlyError = 'OpenAI API key is invalid or expired. Using fallback responses.';
    } else if (errorCode === 'insufficient_quota') {
      userFriendlyError = 'OpenAI API quota exceeded. Using fallback responses.';
    } else if (errorCode === 'rate_limit_exceeded') {
      userFriendlyError = 'OpenAI rate limit exceeded. Please try again later.';
    }
    
    return {
      success: false,
      error: userFriendlyError,
      source: 'openai_error'
    };
  }
};

// Fallback responses for when OpenAI fails
const getFallbackResponse = (language = 'en') => {
  const fallbacks = {
    en: 'I apologize, but I am unable to provide a detailed response at the moment. For medical concerns, please consult with a qualified healthcare provider. If this is an emergency, please seek immediate medical attention.',
    hi: 'मुझे खेद है, लेकिन मैं इस समय विस्तृत उत्तर प्रदान करने में असमर्थ हूं। चिकित्सा संबंधी चिंताओं के लिए, कृपया एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श लें। यदि यह आपातकाल है, तो कृपया तुरंत चिकित्सा सहायता लें।',
    mr: 'मला माफ करा, परंतु मी सध्या तपशीलवार प्रतिसाद देण्यास असमर्थ आहे. वैद्यकीय चिंतेसाठी, कृपया पात्र आरोग्य सेवा प्रदात्याशी सल्लामसलत करा. जर ही आणीबाणी असेल तर कृपया त्वरित वैद्यकीय मदत घ्या.'
  };

  return fallbacks[language] || fallbacks.en;
};

module.exports = {
  shouldUseOpenAI,
  getOpenAIResponse,
  getFallbackResponse
};
