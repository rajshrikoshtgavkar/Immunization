import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const CreateAlert = () => {
  const [vaccines, setVaccines] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [eligibleCount, setEligibleCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchVaccines();
  }, []);

  useEffect(() => {
    if (selectedVaccine) {
      previewEligible();
    }
  }, [selectedVaccine]);

  const fetchVaccines = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/vaccines');
      setVaccines(data.data.filter(v => v.isActive));
    } catch (error) {
      addToast('Failed to fetch vaccines', 'error');
    }
  };

  const previewEligible = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/admin/alerts/preview/${selectedVaccine}`);
      setEligibleCount(data.count);
    } catch (error) {
      setEligibleCount(0);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVaccine || !title || !message) {
      addToast('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/alerts', {
        vaccineId: selectedVaccine,
        title,
        message
      });
      addToast('Alert sent successfully');
      navigate('/admin/alerts');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to send alert', 'error');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/admin/alerts')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Alerts
      </button>

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Vaccine Alert</h1>
        <p className="text-gray-600 mb-8">Send notifications to parents of eligible children</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vaccine</label>
            <select
              value={selectedVaccine}
              onChange={(e) => setSelectedVaccine(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a vaccine...</option>
              {vaccines.map(vaccine => (
                <option key={vaccine._id} value={vaccine._id}>
                  {vaccine.name} (Min age: {vaccine.minAgeValue} {vaccine.minAgeUnit})
                </option>
              ))}
            </select>
          </div>

          {selectedVaccine && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-blue-900">{eligibleCount} eligible children</p>
                <p className="text-sm text-blue-700">Alert will be sent to parents of these children</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Time for BCG Vaccination"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              placeholder="Enter your message to parents..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate('/admin/alerts')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!selectedVaccine || !title || !message}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Alert
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Alert</h2>
              <p className="text-gray-600">Send alert to {eligibleCount} parents?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAlert;
