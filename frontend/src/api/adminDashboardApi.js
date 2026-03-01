import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getAdminDashboardStats = async () => {
  try {
    const [parentsRes, childrenRes, vaccinesRes] = await Promise.all([
      axios.get(`${API_URL}/admin/parents`, { headers: getAuthHeader() }),
      axios.get(`${API_URL}/admin/parents`, { headers: getAuthHeader() }),
      axios.get(`${API_URL}/admin/vaccines`, { headers: getAuthHeader() })
    ]);

    // Count total children from all parents
    let totalChildren = 0;
    if (parentsRes.data.data) {
      for (const parent of parentsRes.data.data) {
        totalChildren += parent.childCount || 0;
      }
    }

    return {
      totalParents: parentsRes.data.count || 0,
      totalChildren: totalChildren,
      totalVaccines: vaccinesRes.data.count || 0
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
};
