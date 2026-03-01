import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getSMSLogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const { data } = await axios.get(`${API_URL}/admin/sms-logs?${params}`, {
      headers: getAuthHeader()
    });
    return data;
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    throw error;
  }
};

export const sendVaccinationReminders = async () => {
  try {
    const { data } = await axios.post(`${API_URL}/admin/sms-logs/send-reminders`, {}, {
      headers: getAuthHeader()
    });
    return data;
  } catch (error) {
    console.error('Error sending reminders:', error);
    throw error;
  }
};
