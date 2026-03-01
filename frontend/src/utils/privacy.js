/**
 * Utility functions for data privacy and security
 */

/**
 * Masks Aadhaar number to show only last 4 digits
 * @param {string} aadhaar - Full Aadhaar number
 * @returns {string} Masked Aadhaar (XXXX-XXXX-1234)
 */
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar) return 'Not provided';
  
  const cleaned = aadhaar.replace(/\D/g, '');
  
  if (cleaned.length !== 12) return aadhaar;
  
  const lastFour = cleaned.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
};

/**
 * Masks phone number to show only last 4 digits
 * @param {string} phone - Full phone number
 * @returns {string} Masked phone (XXXXXX1234)
 */
export const maskPhone = (phone) => {
  if (!phone) return 'Not provided';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10) return phone;
  
  const lastFour = cleaned.slice(-4);
  return `${'X'.repeat(cleaned.length - 4)}${lastFour}`;
};

/**
 * Formats date to Indian standard (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatIndianDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Calculates age from date of birth
 * @param {string|Date} dob - Date of birth
 * @returns {string} Age in years/months
 */
export const calculateAge = (dob) => {
  if (!dob) return '-';
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  
  return `${months} month${months > 1 ? 's' : ''}`;
};
