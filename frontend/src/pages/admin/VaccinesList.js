import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const VaccinesList = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalDoses: 1,
    gapBetweenDoses: 0,
    minAgeValue: 0,
    minAgeUnit: 'days'
  });
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/vaccines');
      setVaccines(data.data);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to fetch vaccines', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVaccine) {
        await axios.put(`http://localhost:5000/api/admin/vaccines/${editingVaccine._id}`, formData);
        addToast('Vaccine updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/admin/vaccines', formData);
        addToast('Vaccine created successfully');
      }
      setShowModal(false);
      setEditingVaccine(null);
      setFormData({ name: '', description: '', totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 0, minAgeUnit: 'days' });
      fetchVaccines();
    } catch (error) {
      addToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleToggleActive = async (vaccine) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/vaccines/${vaccine._id}`, { isActive: !vaccine.isActive });
      addToast(`Vaccine ${!vaccine.isActive ? 'activated' : 'deactivated'}`);
      fetchVaccines();
    } catch (error) {
      addToast('Failed to update vaccine', 'error');
    }
  };

  const openEditModal = (vaccine) => {
    setEditingVaccine(vaccine);
    setFormData({
      name: vaccine.name,
      description: vaccine.description,
      totalDoses: vaccine.totalDoses,
      gapBetweenDoses: vaccine.gapBetweenDoses,
      minAgeValue: vaccine.minAgeValue,
      minAgeUnit: vaccine.minAgeUnit
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-white rounded-xl p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vaccine Management</h1>
          <p className="text-gray-600 mt-1">Manage vaccine master data and eligibility</p>
        </div>
        <button
          onClick={() => {
            setEditingVaccine(null);
            setFormData({ name: '', description: '', totalDoses: 1, gapBetweenDoses: 0, minAgeValue: 0, minAgeUnit: 'days' });
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vaccine
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vaccine Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Min Age</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doses</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gap (days)</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vaccines.map(vaccine => (
              <tr key={vaccine._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-800">{vaccine.name}</div>
                    <div className="text-sm text-gray-500">{vaccine.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {vaccine.minAgeValue} {vaccine.minAgeUnit}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{vaccine.totalDoses}</td>
                <td className="px-6 py-4 text-gray-700">{vaccine.gapBetweenDoses}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(vaccine)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vaccine.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {vaccine.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openEditModal(vaccine)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vaccines.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-gray-500">No vaccines added yet</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingVaccine ? 'Edit Vaccine' : 'Add New Vaccine'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Doses</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.totalDoses}
                    onChange={(e) => setFormData({ ...formData, totalDoses: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gap Between Doses (days)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.gapBetweenDoses}
                    onChange={(e) => setFormData({ ...formData, gapBetweenDoses: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Age Value</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minAgeValue}
                    onChange={(e) => setFormData({ ...formData, minAgeValue: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Unit</label>
                  <select
                    value={formData.minAgeUnit}
                    onChange={(e) => setFormData({ ...formData, minAgeUnit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVaccine(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition"
                >
                  {editingVaccine ? 'Update' : 'Create'} Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinesList;
