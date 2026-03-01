import axios from 'axios';

const API_URL = 'http://localhost:5000/api/health';

export const analyzeChildHealth = async (childId, weight, height) => {
  const response = await axios.post(`${API_URL}/analyze/${childId}`, { weight, height });
  return response.data;
};

export const getHealthHistory = async (childId) => {
  const response = await axios.get(`${API_URL}/history/${childId}`);
  return response.data;
};
