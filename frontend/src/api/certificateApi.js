import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getChildCertificate = async (childId) => {
  try {
    const { data } = await axios.get(`${API_URL}/certificates/child/${childId}`, {
      headers: getAuthHeader()
    });
    return data.data;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw error;
  }
};
