const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';



const SYSTEM_PROMPT = `You are a government healthcare assistant for the National Immunization Portal of India.

STRICT RULES:
- Provide ONLY general vaccination information
- Explain vaccine schedules, side effects (general info only), and health awareness
- DO NOT provide medical diagnosis, prescriptions, or treatment plans
- DO NOT give emergency medical advice
- Always suggest consulting a certified doctor for medical decisions
- Keep responses clear, concise, and informative
- If unsure, redirect to official health sources

Your role is informational only. You help parents understand vaccination schedules and general health information.`;

const generateGeminiResponse = async (question, context = {}, language = 'en') => {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured');
    }

    // Sanitize input
    const sanitizedQuestion = question.trim().substring(0, 500);

    // Build context-aware prompt
    let contextInfo = '';
    if (context.medicines && context.medicines.length > 0) {
      const medicineList = context.medicines.map(m => m.name).join(', ');
      contextInfo = `\n\nContext: User has prescription with medicines: ${medicineList}`;
    }

    const languageInstruction = language === 'hi' 
      ? '\n\nRespond in Hindi language.' 
      : language === 'mr' 
      ? '\n\nRespond in Marathi language.' 
      : '';

    const fullPrompt = `${SYSTEM_PROMPT}${contextInfo}${languageInstruction}\n\nUser Question: ${sanitizedQuestion}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return {
        success: true,
        response: response.data.candidates[0].content.parts[0].text
      };
    }

    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Gemini API Error Details:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 400) {
        return {
          success: false,
          error: 'Invalid API key or request format. Please check your Gemini API key configuration.'
        };
      } else if (status === 403) {
        return {
          success: false,
          error: 'API access forbidden. Please enable Generative Language API in Google Cloud Console.'
        };
      } else if (status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Free tier: 60 requests/minute. Please try again later.'
        };
      } else {
        return {
          success: false,
          error: `API error (${status}): ${errorData.error?.message || 'Unknown error'}`
        };
      }
    } else if (error.request) {
      console.error('No response received:', error.message);
      return {
        success: false,
        error: 'Network error. Please check your internet connection.'
      };
    } else {
      console.error('Request setup error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

const isGeminiEnabled = () => {
  return GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
};

module.exports = {
  generateGeminiResponse,
  isGeminiEnabled
};
