// Medical translation dictionary
const medicalTranslations = {
  disclaimer: {
    en: 'This AI provides informational guidance only and is not a substitute for professional medical advice.',
    hi: 'यह AI केवल सूचनात्मक मार्गदर्शन प्रदान करता है और पेशेवर चिकित्सा सलाह का विकल्प नहीं है।',
    mr: 'हा AI केवळ माहितीपूर्ण मार्गदर्शन प्रदान करतो आणि व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही।'
  },
  commonTerms: {
    'side effects': { en: 'Side Effects', hi: 'दुष्प्रभाव', mr: 'दुष्परिणाम' },
    'precautions': { en: 'Precautions', hi: 'सावधानियां', mr: 'खबरदारी' },
    'dosage': { en: 'Dosage', hi: 'खुराक', mr: 'डोस' },
    'frequency': { en: 'Frequency', hi: 'आवृत्ति', mr: 'वारंवारता' },
    'duration': { en: 'Duration', hi: 'अवधि', mr: 'कालावधी' },
    'medicine': { en: 'Medicine', hi: 'दवा', mr: 'औषध' },
    'doctor': { en: 'Doctor', hi: 'डॉक्टर', mr: 'डॉक्टर' },
    'prescription': { en: 'Prescription', hi: 'नुस्खा', mr: 'प्रिस्क्रिप्शन' }
  }
};

// Simple rule-based translation for common medical terms
const translateText = (text, targetLang) => {
  if (targetLang === 'en' || !text) return text;
  
  // This is a simplified version. In production, use Google Translate API or similar
  let translated = text;
  
  Object.keys(medicalTranslations.commonTerms).forEach(term => {
    const regex = new RegExp(term, 'gi');
    if (medicalTranslations.commonTerms[term][targetLang]) {
      translated = translated.replace(regex, medicalTranslations.commonTerms[term][targetLang]);
    }
  });
  
  return translated;
};

const getDisclaimer = (lang = 'en') => {
  return medicalTranslations.disclaimer[lang] || medicalTranslations.disclaimer.en;
};

// Medicine knowledge base with multilingual support
const getMedicineInfo = (medicineName, language = 'en') => {
  // Simplified medicine database
  const medicineDB = {
    'paracetamol': {
      usage: {
        en: 'Used to treat pain and reduce fever',
        hi: 'दर्द का इलाज करने और बुखार कम करने के लिए उपयोग किया जाता है',
        mr: 'वेदना कमी करण्यासाठी आणि ताप कमी करण्यासाठी वापरले जाते'
      },
      sideEffects: {
        en: ['Nausea', 'Stomach pain', 'Loss of appetite'],
        hi: ['मतली', 'पेट दर्द', 'भूख न लगना'],
        mr: ['मळमळ', 'पोटदुखी', 'भूक न लागणे']
      },
      precautions: {
        en: ['Do not exceed recommended dose', 'Avoid alcohol', 'Consult doctor if pregnant'],
        hi: ['अनुशंसित खुराक से अधिक न लें', 'शराब से बचें', 'गर्भवती होने पर डॉक्टर से परामर्श लें'],
        mr: ['शिफारस केलेल्या डोसपेक्षा जास्त घेऊ नका', 'दारू टाळा', 'गर्भवती असल्यास डॉक्टरांचा सल्ला घ्या']
      }
    },
    'amoxicillin': {
      usage: {
        en: 'Antibiotic used to treat bacterial infections',
        hi: 'जीवाणु संक्रमण के इलाज के लिए उपयोग किया जाने वाला एंटीबायोटिक',
        mr: 'जीवाणू संसर्गाच्या उपचारासाठी वापरले जाणारे प्रतिजैविक'
      },
      sideEffects: {
        en: ['Diarrhea', 'Nausea', 'Skin rash'],
        hi: ['दस्त', 'मतली', 'त्वचा पर चकत्ते'],
        mr: ['अतिसार', 'मळमळ', 'त्वचेवर पुरळ']
      },
      precautions: {
        en: ['Complete full course', 'Take with food', 'Inform doctor of allergies'],
        hi: ['पूरा कोर्स पूरा करें', 'भोजन के साथ लें', 'एलर्जी के बारे में डॉक्टर को सूचित करें'],
        mr: ['संपूर्ण कोर्स पूर्ण करा', 'अन्नासोबत घ्या', 'ऍलर्जीबद्दल डॉक्टरांना कळवा']
      }
    }
  };

  const medicineLower = medicineName.toLowerCase();
  const info = medicineDB[medicineLower];

  if (info) {
    return {
      usage: info.usage[language] || info.usage.en,
      sideEffects: info.sideEffects[language] || info.sideEffects.en,
      precautions: info.precautions[language] || info.precautions.en
    };
  }

  // Default response if medicine not in database
  return {
    usage: language === 'en' ? 'Medicine information not available in database' :
           language === 'hi' ? 'डेटाबेस में दवा की जानकारी उपलब्ध नहीं है' :
           'डेटाबेसमध्ये औषधाची माहिती उपलब्ध नाही',
    sideEffects: [],
    precautions: []
  };
};

module.exports = {
  translateText,
  getDisclaimer,
  getMedicineInfo,
  medicalTranslations
};
