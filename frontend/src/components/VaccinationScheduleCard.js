import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VaccinationScheduleCard = () => {
  const [upcomingVaccines, setUpcomingVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingVaccines();
  }, []);

  const fetchUpcomingVaccines = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const childrenRes = await axios.get('http://localhost:5000/api/parent/children', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const children = childrenRes.data.data || [];
      const allUpcoming = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const child of children) {
        const scheduleRes = await axios.get(`http://localhost:5000/api/parent/vaccinations/${child._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const records = scheduleRes.data.data || [];
        
        records.forEach(record => {
          const doseDate = new Date(record.doseDate);
          doseDate.setHours(0, 0, 0, 0);
          
          if (record.status === 'UPCOMING' && doseDate >= today) {
            allUpcoming.push({
              ...record,
              childName: child.name,
              childId: child._id
            });
          }
        });
      }

      allUpcoming.sort((a, b) => new Date(a.doseDate) - new Date(b.doseDate));
      setUpcomingVaccines(allUpcoming.slice(0, 5));
    } catch (error) {
      console.error('Error fetching upcoming vaccines:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (doseDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dose = new Date(doseDate);
    dose.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((dose - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Due Soon</span>;
    } else if (diffDays <= 30) {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Upcoming</span>;
    }
    return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Scheduled</span>;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
      >
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-gray-800">Upcoming Vaccinations</h3>
        </div>
      </div>

      {upcomingVaccines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 font-semibold">No upcoming vaccinations available</p>
          <p className="text-gray-400 text-sm mt-2">All vaccinations are up to date</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {upcomingVaccines.map((vaccine, index) => (
            <motion.div
              key={`${vaccine.childId}-${vaccine.vaccine._id}-${vaccine.doseNumber}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5, scale: 1.01 }}
              onClick={() => navigate(`/parent/vaccinations/${vaccine.childId}`)}
              className="group relative bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-5 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-gray-800">{vaccine.vaccine.name}</h4>
                    {getStatusBadge(vaccine.doseDate)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold">{vaccine.childName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">{new Date(vaccine.doseDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span className="font-semibold">Dose {vaccine.doseNumber}</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          {upcomingVaccines.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/parent/children')}
              className="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              View All Schedules
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VaccinationScheduleCard;
