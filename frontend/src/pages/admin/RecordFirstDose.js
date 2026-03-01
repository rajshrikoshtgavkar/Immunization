import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const RecordFirstDose = () => {
  const [children, setChildren] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [formData, setFormData] = useState({ childId: '', vaccineId: '', doseDate: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [parentsRes, vaccinesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/parents'),
        axios.get('http://localhost:5000/api/admin/vaccines')
      ]);

      const allChildren = [];
      for (const parent of parentsRes.data.data) {
        const { data } = await axios.get(`http://localhost:5000/api/admin/parents/${parent._id}`);
        allChildren.push(...data.data.children.map(c => ({ ...c, parentName: parent.name })));
      }

      setChildren(allChildren);
      setVaccines(vaccinesRes.data.data.filter(v => v.isActive));
    } catch (error) {
      addToast('Failed to fetch data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/admin/vaccinations/first-dose', formData);
      addToast('Vaccination schedule created successfully');
      navigate(`/admin/vaccinations/${formData.childId}`);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Record First Dose</h1>
      <p className="text-gray-600 mb-8">Create vaccination schedule for a child</p>

      <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Child</label>
            <select
              required
              value={formData.childId}
              onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a child...</option>
              {children.map(child => (
                <option key={child._id} value={child._id}>
                  {child.name} (Parent: {child.parentName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Vaccine</label>
            <select
              required
              value={formData.vaccineId}
              onChange={(e) => setFormData({ ...formData, vaccineId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a vaccine...</option>
              {vaccines.map(vaccine => (
                <option key={vaccine._id} value={vaccine._id}>
                  {vaccine.name} ({vaccine.totalDoses} doses)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Dose Date</label>
            <input
              type="date"
              required
              value={formData.doseDate}
              onChange={(e) => setFormData({ ...formData, doseDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordFirstDose;
