import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const askQuestion = async (question, language = 'en', prescriptionId = null, childId = null) => {
  const response = await axios.post(`${API_URL}/ask`, {
    question,
    language,
    prescriptionId,
    childId
  }, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getChatHistory = async () => {
  const response = await axios.get(`${API_URL}/history`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const setLanguagePreference = async (language) => {
  const response = await axios.post(`${API_URL}/set-language`, { language }, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getLanguagePreference = async () => {
  const response = await axios.get(`${API_URL}/get-language`, {
    headers: getAuthHeader()
  });
  return response.data;
};
