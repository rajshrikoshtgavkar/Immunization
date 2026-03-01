import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getVaccineInventory = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/admin/vaccine-stock`, {
      headers: getAuthHeader()
    });
    return data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const updateVaccineStock = async (vaccineId, stockData) => {
  try {
    const { data } = await axios.put(`${API_URL}/admin/vaccine-stock/${vaccineId}`, stockData, {
      headers: getAuthHeader()
    });
    return data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const getStockAlerts = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/admin/vaccine-stock/alerts`, {
      headers: getAuthHeader()
    });
    return data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};
