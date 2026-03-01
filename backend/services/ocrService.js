const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: m => console.log(m)
      }
    );
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
};

const parsePrescriptionText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  
  const prescription = {
    doctorName: null,
    prescriptionDate: null,
    medicines: []
  };

  // Simple parsing logic (can be enhanced with regex patterns)
  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    
    // Extract doctor name
    if (lowerLine.includes('dr.') || lowerLine.includes('doctor')) {
      prescription.doctorName = line.trim();
    }
    
    // Extract date
    const dateMatch = line.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/);
    if (dateMatch && !prescription.prescriptionDate) {
      prescription.prescriptionDate = dateMatch[0];
    }
    
    // Extract medicines (basic pattern matching)
    if (lowerLine.match(/tab|cap|syrup|injection|mg|ml/)) {
      const medicine = {
        name: line.trim(),
        dosage: '',
        frequency: '',
        duration: ''
      };
      
      // Try to extract dosage
      const dosageMatch = line.match(/\d+\s*(mg|ml|g)/i);
      if (dosageMatch) {
        medicine.dosage = dosageMatch[0];
      }
      
      // Try to extract frequency
      if (lowerLine.match(/once|twice|thrice|daily|morning|evening|night/)) {
        medicine.frequency = line.match(/once|twice|thrice|daily|morning|evening|night/i)[0];
      }
      
      // Try to extract duration
      const durationMatch = line.match(/\d+\s*(day|days|week|weeks|month|months)/i);
      if (durationMatch) {
        medicine.duration = durationMatch[0];
      }
      
      prescription.medicines.push(medicine);
    }
  });

  return prescription;
};

module.exports = {
  extractTextFromImage,
  parsePrescriptionText
};
