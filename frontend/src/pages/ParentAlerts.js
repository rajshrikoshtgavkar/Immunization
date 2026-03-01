import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParentLayout from '../components/ParentLayout';
import axios from 'axios';

const ParentAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/parent/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/parent/alerts/${alertId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alerts.map(alert =>
        alert._id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  if (loading) {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full"
          />
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-20"></div>
          <div className="relative flex items-center gap-4">
            <h1 className="text-6xl font-black">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Notifications
              </span>
            </h1>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-black rounded-2xl shadow-lg"
              >
                {unreadCount} New
              </motion.span>
            )}
          </div>
          <p className="text-xl text-gray-600 font-medium mt-3">Important vaccination reminders for your children</p>
        </motion.div>

        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </motion.div>
            <p className="text-xl font-bold text-gray-500">No notifications yet</p>
            <p className="text-gray-400 mt-2">You'll receive alerts when vaccines are due</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all overflow-hidden ${
                  alert.isRead
                    ? 'border-gray-100'
                    : 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
                }`}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                  alert.isRead ? 'bg-gray-200' : 'bg-blue-300'
                }`}></div>
                
                <div className="relative z-10 flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    alert.isRead 
                      ? 'bg-gray-100' 
                      : 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg'
                  }`}>
                    <svg className={`w-8 h-8 ${alert.isRead ? 'text-gray-600' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-black text-gray-800 text-2xl mb-1">{alert.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-600">{alert.vaccine?.name}</span>
                          {!alert.isRead && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 font-semibold">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">{alert.message}</p>

                    {alert.children && alert.children.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-6">
                        {alert.children.map(child => (
                          <div key={child._id} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm font-bold text-gray-700">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!alert.isRead && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsRead(alert._id)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark as Read
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
};

export default ParentAlerts;
