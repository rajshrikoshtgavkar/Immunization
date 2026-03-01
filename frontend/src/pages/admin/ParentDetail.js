import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const ParentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditParent, setShowEditParent] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', gender: 'male' });
  const [parentFormData, setParentFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchParentDetails();
  }, [id]);

  const fetchParentDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/admin/parents/${id}`);
      setParent(data.data.parent);
      setChildren(data.data.children);
      setParentFormData({
        name: data.data.parent.name,
        email: data.data.parent.email,
        phone: data.data.parent.phone || ''
      });
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to fetch parent details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateParent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admin/parents/${id}`, parentFormData);
      addToast('Parent updated successfully');
      setShowEditParent(false);
      fetchParentDetails();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update parent', 'error');
    }
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const age = new Date(diff);
    const years = Math.abs(age.getUTCFullYear() - 1970);
    const months = age.getUTCMonth();
    if (years === 0) return `${months} months`;
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChild) {
        await axios.put(`http://localhost:5000/api/admin/children/${editingChild._id}`, formData);
        addToast('Child updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/admin/children', { ...formData, parent: id });
        addToast('Child added successfully');
      }
      setShowModal(false);
      setEditingChild(null);
      setFormData({ name: '', dateOfBirth: '', gender: 'male' });
      fetchParentDetails();
    } catch (error) {
      addToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (childId) => {
    if (!window.confirm('Are you sure you want to delete this child?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/children/${childId}`);
      addToast('Child deleted successfully');
      fetchParentDetails();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete child', 'error');
    }
  };

  const openEditModal = (child) => {
    setEditingChild(child);
    setFormData({
      name: child.name,
      dateOfBirth: new Date(child.dateOfBirth).toISOString().split('T')[0],
      gender: child.gender
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingChild(null);
    setFormData({ name: '', dateOfBirth: '', gender: 'male' });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/parents')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Parents
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {parent?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{parent?.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{parent?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditParent(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition text-sm font-medium"
          >
            Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Aadhaar Number</p>
            <p className="text-sm font-mono text-gray-800">
              {parent?.maskedAadhaar || 'Not linked'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
            <p className="text-sm text-gray-800">
              {parent?.phone || (
                <span className="text-yellow-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Not provided
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Children</p>
            <p className="text-sm text-gray-800">{children.length} {children.length === 1 ? 'Child' : 'Children'}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Children</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Child
        </button>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-500">No children added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map(child => (
            <div key={child._id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    child.gender === 'male' ? 'bg-blue-500' : child.gender === 'female' ? 'bg-pink-500' : 'bg-purple-500'
                  }`}>
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{child.name}</h3>
                    <p className="text-sm text-gray-500">{calculateAge(child.dateOfBirth)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(child.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    child.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                    child.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {child.gender.charAt(0).toUpperCase() + child.gender.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/vaccinations/${child._id}`)}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded transition text-sm font-medium"
                >
                  History
                </button>
                <button
                  onClick={() => navigate(`/admin/child-eligibility/${child._id}`)}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 rounded transition text-sm font-medium"
                >
                  Vaccines
                </button>
                <button
                  onClick={() => openEditModal(child)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(child._id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}\n        </div>
      )}

      {showEditParent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Parent Details</h2>
            <form onSubmit={handleUpdateParent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={parentFormData.name}
                  onChange={(e) => setParentFormData({ ...parentFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={parentFormData.email}
                  onChange={(e) => setParentFormData({ ...parentFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={parentFormData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setParentFormData({ ...parentFormData, phone: value });
                    }
                  }}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Required for SMS notifications</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Aadhaar number cannot be edited for security reasons.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditParent(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {editingChild ? 'Edit Child' : 'Add New Child'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex gap-3">
                  {['male', 'female', 'other'].map(gender => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`flex-1 py-2 rounded border-2 transition text-sm ${
                        formData.gender === gender
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingChild(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  {editingChild ? 'Update' : 'Add'} Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDetail;
