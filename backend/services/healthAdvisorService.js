const VaccinationRecord = require('../models/VaccinationRecord');

const calculateAgeInMonths = (dateOfBirth) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  return (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
};

const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const classifyHealthCategory = (bmi, ageInMonths) => {
  if (ageInMonths < 24) {
    if (bmi < 14) return 'Underweight';
    if (bmi > 18) return 'Overweight';
    return 'Normal';
  } else if (ageInMonths < 60) {
    if (bmi < 13.5) return 'Underweight';
    if (bmi > 17) return 'Overweight';
    return 'Normal';
  } else {
    if (bmi < 14) return 'Underweight';
    if (bmi > 19) return 'Overweight';
    return 'Normal';
  }
};

const generateFoodSuggestions = (category, ageInMonths) => {
  const suggestions = [];

  if (category === 'Underweight') {
    suggestions.push('Include protein-rich foods: eggs, dal, paneer, chicken');
    suggestions.push('Add healthy fats: ghee, nuts (if age appropriate), avocado');
    suggestions.push('Increase meal frequency to 5-6 small meals per day');
    suggestions.push('Include banana, sweet potato, and rice for energy');
    if (ageInMonths > 12) suggestions.push('Add peanut butter and cheese to diet');
  } else if (category === 'Overweight') {
    suggestions.push('Reduce sugar intake and avoid processed foods');
    suggestions.push('Include more vegetables and fruits in meals');
    suggestions.push('Limit fried foods and opt for steamed/boiled options');
    suggestions.push('Encourage physical activity and outdoor play');
    suggestions.push('Control portion sizes and avoid overeating');
  } else {
    suggestions.push('Maintain balanced diet with all food groups');
    suggestions.push('Include seasonal fruits and vegetables daily');
    suggestions.push('Ensure adequate protein from dal, eggs, milk');
    suggestions.push('Keep child hydrated with water throughout the day');
    suggestions.push('Continue regular meal timings');
  }

  return suggestions;
};

const generateVitaminRecommendations = (category) => {
  const recommendations = [
    'Vitamin D: Ensure 15-20 minutes of morning sunlight daily',
    'Vitamin A: Include carrots, spinach, and orange vegetables',
    'Vitamin C: Add citrus fruits, guava, and tomatoes',
    'Iron: Include green leafy vegetables and jaggery',
    'Calcium: Ensure adequate milk/dairy intake for bone growth'
  ];

  if (category === 'Underweight') {
    recommendations.push('Consider multivitamin supplement after pediatrician consultation');
    recommendations.push('Vitamin B-complex for appetite improvement');
  }

  return recommendations;
};

const generateDiseasePrecautions = (category) => {
  const precautions = [];

  if (category === 'Underweight') {
    precautions.push('Higher risk of infections due to weak immunity');
    precautions.push('Monitor for signs of malnutrition: fatigue, weakness');
    precautions.push('Watch for frequent colds and respiratory infections');
    precautions.push('Ensure complete vaccination to prevent diseases');
  } else if (category === 'Overweight') {
    precautions.push('Risk of childhood obesity and related complications');
    precautions.push('Monitor blood sugar levels if family history of diabetes');
    precautions.push('Watch for breathing difficulties during sleep');
    precautions.push('Regular health checkups recommended');
  } else {
    precautions.push('Maintain good hygiene to prevent common infections');
    precautions.push('Watch for seasonal flu and take preventive measures');
    precautions.push('Keep vaccination schedule up to date');
  }

  return precautions;
};

const generateHygieneAdvice = (ageInMonths) => {
  const advice = [
    'Wash hands before meals and after using toilet',
    'Keep nails trimmed and clean',
    'Brush teeth twice daily',
    'Bathe regularly and maintain personal hygiene',
    'Ensure adequate sleep (10-12 hours for children)',
    'Encourage outdoor play for immunity building'
  ];

  if (ageInMonths < 24) {
    advice.push('Sterilize feeding bottles and utensils properly');
    advice.push('Keep toys clean and sanitized');
  }

  return advice;
};

const generateMissedVaccineWarnings = async (childId) => {
  const warnings = [];
  const today = new Date();

  const missedVaccines = await VaccinationRecord.find({
    child: childId,
    status: 'UPCOMING',
    doseDate: { $lt: today }
  }).populate('vaccine');

  if (missedVaccines.length > 0) {
    warnings.push(`⚠️ ALERT: ${missedVaccines.length} vaccine dose(s) are overdue!`);
    warnings.push('Missed vaccines increase risk of preventable diseases');
    warnings.push('Contact healthcare provider immediately to reschedule');
    
    missedVaccines.forEach(record => {
      warnings.push(`- ${record.vaccine.name} (Dose ${record.doseNumber}) was due on ${record.doseDate.toLocaleDateString()}`);
    });

    warnings.push('Extra precautions: Avoid crowded places until vaccination is complete');
    warnings.push('Monitor for symptoms of vaccine-preventable diseases');
  }

  return warnings;
};

const analyzeChildHealth = async (child, weight, height) => {
  const ageInMonths = calculateAgeInMonths(child.dateOfBirth);
  const bmi = calculateBMI(weight, height);
  const category = classifyHealthCategory(bmi, ageInMonths);

  const suggestions = generateFoodSuggestions(category, ageInMonths);
  const vitaminRecommendations = generateVitaminRecommendations(category);
  const diseasePrecautions = generateDiseasePrecautions(category);
  const hygieneAdvice = generateHygieneAdvice(ageInMonths);
  const missedVaccineWarnings = await generateMissedVaccineWarnings(child._id);

  return {
    ageInMonths,
    bmi: parseFloat(bmi.toFixed(2)),
    category,
    suggestions,
    vitaminRecommendations,
    diseasePrecautions,
    hygieneAdvice,
    missedVaccineWarnings
  };
};

module.exports = {
  analyzeChildHealth,
  calculateAgeInMonths,
  calculateBMI
};
