import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getAdminVaccinationSchedule = async (childId) => {
  const { data } = await axios.get(`${API_URL}/admin/vaccinations/${childId}`, {
    headers: getAuthHeader()
  });
  return data;
};

export const getParentVaccinationSchedule = async (childId) => {
  const { data } = await axios.get(`${API_URL}/parent/vaccinations/${childId}`, {
    headers: getAuthHeader()
  });
  return data;
};

export const getOverallReport = async () => {
  const { data } = await axios.get(`${API_URL}/admin/reports/overall`, {
    headers: getAuthHeader()
  });
  return data;
};

export const getVaccineWiseReport = async () => {
  const { data } = await axios.get(`${API_URL}/admin/reports/vaccine-wise`, {
    headers: getAuthHeader()
  });
  return data;
};
