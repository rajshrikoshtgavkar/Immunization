// Convert age to days based on unit
const convertToDays = (value, unit) => {
  const conversions = {
    days: 1,
    weeks: 7,
    months: 30,
    years: 365
  };
  return value * conversions[unit];
};

// Calculate child age in days from DOB
const calculateAgeInDays = (dateOfBirth) => {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  const diffTime = Math.abs(today - dob);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if child is eligible for vaccine
const isEligible = (childDOB, vaccine) => {
  const childAgeInDays = calculateAgeInDays(childDOB);
  const vaccineMinAgeInDays = convertToDays(vaccine.minAgeValue, vaccine.minAgeUnit);
  return childAgeInDays >= vaccineMinAgeInDays;
};

// Format age display
const formatAge = (value, unit) => {
  return `${value} ${unit}`;
};

module.exports = {
  convertToDays,
  calculateAgeInDays,
  isEligible,
  formatAge
};
