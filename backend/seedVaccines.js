const mongoose = require('mongoose');
const Vaccine = require('./models/Vaccine');

const vaccines = [
  { name: "BCG", description: "Bacillus Calmette-Guérin vaccine for tuberculosis", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 0, minAgeUnit: "days", isActive: true },
  { name: "Hepatitis B (Birth Dose)", description: "Hepatitis B vaccine given at birth", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 0, minAgeUnit: "days", isActive: true },
  { name: "OPV 0", description: "Oral Polio Vaccine birth dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 0, minAgeUnit: "days", isActive: true },
  { name: "OPV 1", description: "Oral Polio Vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "OPV 2", description: "Oral Polio Vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 10, minAgeUnit: "weeks", isActive: true },
  { name: "OPV 3", description: "Oral Polio Vaccine third dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 14, minAgeUnit: "weeks", isActive: true },
  { name: "IPV 1", description: "Inactivated Polio Vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "IPV 2", description: "Inactivated Polio Vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 14, minAgeUnit: "weeks", isActive: true },
  { name: "Pentavalent 1", description: "DPT-HepB-Hib combination vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Pentavalent 2", description: "DPT-HepB-Hib combination vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 10, minAgeUnit: "weeks", isActive: true },
  { name: "Pentavalent 3", description: "DPT-HepB-Hib combination vaccine third dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 14, minAgeUnit: "weeks", isActive: true },
  { name: "Rotavirus 1", description: "Rotavirus vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Rotavirus 2", description: "Rotavirus vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 10, minAgeUnit: "weeks", isActive: true },
  { name: "Rotavirus 3", description: "Rotavirus vaccine third dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 14, minAgeUnit: "weeks", isActive: true },
  { name: "PCV 1", description: "Pneumococcal Conjugate Vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "PCV 2", description: "Pneumococcal Conjugate Vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 14, minAgeUnit: "weeks", isActive: true },
  { name: "PCV Booster", description: "Pneumococcal Conjugate Vaccine booster dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "MR 1", description: "Measles-Rubella vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "MR 2", description: "Measles-Rubella vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 16, minAgeUnit: "months", isActive: true },
  { name: "JE 1", description: "Japanese Encephalitis vaccine first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "JE 2", description: "Japanese Encephalitis vaccine second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 16, minAgeUnit: "months", isActive: true },
  { name: "Vitamin A 1", description: "Vitamin A supplementation first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "DPT Booster 1", description: "Diphtheria-Pertussis-Tetanus booster first dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 16, minAgeUnit: "months", isActive: true },
  { name: "DPT Booster 2", description: "Diphtheria-Pertussis-Tetanus booster second dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 5, minAgeUnit: "years", isActive: true },
  { name: "Td", description: "Tetanus-Diphtheria vaccine for adolescents", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 10, minAgeUnit: "years", isActive: true },
  { name: "HPV", description: "Human Papillomavirus vaccine for girls", totalDoses: 2, gapBetweenDoses: 180, minAgeValue: 9, minAgeUnit: "years", isActive: true },
  { name: "Typhoid Conjugate Vaccine", description: "Typhoid fever prevention vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 6, minAgeUnit: "months", isActive: true },
  { name: "Hepatitis A", description: "Hepatitis A virus vaccine", totalDoses: 2, gapBetweenDoses: 180, minAgeValue: 1, minAgeUnit: "years", isActive: true },
  { name: "Varicella", description: "Chickenpox vaccine", totalDoses: 2, gapBetweenDoses: 90, minAgeValue: 1, minAgeUnit: "years", isActive: true },
  { name: "MMR", description: "Measles-Mumps-Rubella vaccine", totalDoses: 2, gapBetweenDoses: 90, minAgeValue: 12, minAgeUnit: "months", isActive: true },
  { name: "Influenza (Pediatric)", description: "Seasonal flu vaccine for children", totalDoses: 2, gapBetweenDoses: 30, minAgeValue: 6, minAgeUnit: "months", isActive: true },
  { name: "Influenza (Adult)", description: "Seasonal flu vaccine for adults", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "Meningococcal ACWY", description: "Meningococcal meningitis vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 2, minAgeUnit: "years", isActive: true },
  { name: "Rabies (Pre-exposure)", description: "Rabies prevention vaccine", totalDoses: 3, gapBetweenDoses: 7, minAgeValue: 0, minAgeUnit: "days", isActive: true },
  { name: "Rabies (Post-exposure)", description: "Rabies treatment vaccine", totalDoses: 5, gapBetweenDoses: 3, minAgeValue: 0, minAgeUnit: "days", isActive: true },
  { name: "Yellow Fever", description: "Yellow fever prevention vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "Cholera", description: "Cholera prevention oral vaccine", totalDoses: 2, gapBetweenDoses: 14, minAgeValue: 1, minAgeUnit: "years", isActive: true },
  { name: "Tetanus Toxoid (TT1)", description: "Tetanus toxoid first dose for pregnant women", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 15, minAgeUnit: "years", isActive: true },
  { name: "Tetanus Toxoid (TT2)", description: "Tetanus toxoid second dose for pregnant women", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 15, minAgeUnit: "years", isActive: true },
  { name: "COVID-19 (Covishield)", description: "COVID-19 vaccine AstraZeneca", totalDoses: 2, gapBetweenDoses: 84, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "COVID-19 (Covaxin)", description: "COVID-19 vaccine Bharat Biotech", totalDoses: 2, gapBetweenDoses: 28, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "COVID-19 (Sputnik V)", description: "COVID-19 vaccine Russian", totalDoses: 2, gapBetweenDoses: 21, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "COVID-19 Booster", description: "COVID-19 precaution dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "Pneumococcal Polysaccharide (PPSV23)", description: "Pneumonia vaccine for adults", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 65, minAgeUnit: "years", isActive: true },
  { name: "Herpes Zoster", description: "Shingles vaccine for elderly", totalDoses: 2, gapBetweenDoses: 60, minAgeValue: 50, minAgeUnit: "years", isActive: true },
  { name: "Hepatitis B (Adult)", description: "Hepatitis B vaccine for adults", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "Tdap", description: "Tetanus-Diphtheria-Pertussis vaccine for adults", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 19, minAgeUnit: "years", isActive: true },
  { name: "Meningococcal B", description: "Meningococcal B meningitis vaccine", totalDoses: 2, gapBetweenDoses: 30, minAgeValue: 10, minAgeUnit: "years", isActive: true },
  { name: "Hib", description: "Haemophilus influenzae type b vaccine", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 2, minAgeUnit: "months", isActive: true },
  { name: "Rotavirus (2-dose)", description: "Rotavirus vaccine 2-dose schedule", totalDoses: 2, gapBetweenDoses: 60, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Dengue", description: "Dengue fever prevention vaccine", totalDoses: 3, gapBetweenDoses: 180, minAgeValue: 9, minAgeUnit: "years", isActive: true },
  { name: "Tick-borne Encephalitis", description: "TBE virus vaccine", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 1, minAgeUnit: "years", isActive: true },
  { name: "Anthrax", description: "Anthrax prevention vaccine", totalDoses: 3, gapBetweenDoses: 14, minAgeValue: 18, minAgeUnit: "years", isActive: true },
  { name: "Smallpox", description: "Smallpox prevention vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 1, minAgeUnit: "years", isActive: true },
  { name: "Tuberculosis (BCG Revaccination)", description: "BCG booster for tuberculosis", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 5, minAgeUnit: "years", isActive: true },
  { name: "Polio Booster", description: "Polio booster dose", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 5, minAgeUnit: "years", isActive: true },
  { name: "Measles", description: "Measles vaccine standalone", totalDoses: 2, gapBetweenDoses: 90, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "Rubella", description: "Rubella vaccine standalone", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "Mumps", description: "Mumps vaccine standalone", totalDoses: 2, gapBetweenDoses: 90, minAgeValue: 12, minAgeUnit: "months", isActive: true },
  { name: "Diphtheria", description: "Diphtheria vaccine standalone", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Pertussis", description: "Whooping cough vaccine standalone", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Tetanus", description: "Tetanus vaccine standalone", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Haemophilus Influenzae", description: "Hib vaccine standalone", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Pneumococcal (13-valent)", description: "PCV13 vaccine", totalDoses: 3, gapBetweenDoses: 60, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Rotavirus (3-dose)", description: "Rotavirus vaccine 3-dose schedule", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 6, minAgeUnit: "weeks", isActive: true },
  { name: "Hepatitis B (3-dose)", description: "Hepatitis B vaccine 3-dose schedule", totalDoses: 3, gapBetweenDoses: 30, minAgeValue: 0, minAgeUnit: "days", isActive: true },
  { name: "Japanese Encephalitis (Live)", description: "JE live attenuated vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "Typhoid (Oral)", description: "Typhoid oral vaccine", totalDoses: 3, gapBetweenDoses: 2, minAgeValue: 6, minAgeUnit: "years", isActive: true },
  { name: "Typhoid (Injectable)", description: "Typhoid injectable vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 2, minAgeUnit: "years", isActive: true },
  { name: "Meningococcal Conjugate", description: "Meningococcal conjugate vaccine", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 9, minAgeUnit: "months", isActive: true },
  { name: "Influenza (High-dose)", description: "High-dose flu vaccine for elderly", totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 65, minAgeUnit: "years", isActive: true },
  { name: "Zoster (Recombinant)", description: "Recombinant shingles vaccine", totalDoses: 2, gapBetweenDoses: 60, minAgeValue: 50, minAgeUnit: "years", isActive: true }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaccination_db')
  .then(async () => {
    console.log('MongoDB connected');
    await Vaccine.deleteMany({});
    console.log('Existing vaccines cleared');
    await Vaccine.insertMany(vaccines);
    console.log('72 vaccines seeded successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
