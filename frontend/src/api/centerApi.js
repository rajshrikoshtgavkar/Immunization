import axios from 'axios';

const API_URL = 'http://localhost:5000/api/centers';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getNearbyCenters = async (lat, lng, radius = 5000) => {
  const response = await axios.get(`${API_URL}/nearby`, {
    params: { lat, lng, radius },
    headers: getAuthHeader()
  });
  return response.data;
};

export const getCenterDetails = async (placeId) => {
  const response = await axios.get(`${API_URL}/${placeId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};
