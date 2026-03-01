import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const getParentDashboardStats = async () => {
  try {
    console.log('Fetching parent dashboard stats...');
    
    const childrenRes = await axios.get(`${API_URL}/parent/children`, {
      headers: getAuthHeader()
    });

    console.log('Children Response:', childrenRes.data);
    
    const children = childrenRes.data.data || [];
    let upcomingVaccines = 0;
    let missedVaccines = 0;

    // Fetch vaccination records for each child
    for (const child of children) {
      try {
        const scheduleRes = await axios.get(`${API_URL}/parent/vaccinations/${child._id}`, {
          headers: getAuthHeader()
        });
        
        console.log(`Schedule for child ${child.name}:`, scheduleRes.data);
        
        const records = scheduleRes.data.data || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        records.forEach(record => {
          const doseDate = new Date(record.doseDate);
          doseDate.setHours(0, 0, 0, 0);
          
          if (record.status === 'UPCOMING') {
            if (doseDate < today) {
              missedVaccines++;
            } else {
              upcomingVaccines++;
            }
          }
        });
      } catch (error) {
        console.error(`Error fetching schedule for child ${child._id}:`, error);
      }
    }

    const stats = {
      totalChildren: children.length,
      upcomingVaccines,
      missedVaccines
    };
    
    console.log('Final Parent Stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching parent dashboard stats:', error);
    throw error;
  }
};

export const getChildren = async () => {
  const response = await axios.get(`${API_URL}/parent/children`, {
    headers: getAuthHeader()
  });
  return response.data;
};
