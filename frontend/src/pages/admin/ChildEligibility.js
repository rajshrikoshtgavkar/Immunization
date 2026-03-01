import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';

const ChildEligibility = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEligibility();
  }, [childId]);

  const fetchEligibility = async () => {
    try {
      const { data: response } = await axios.get(`http://localhost:5000/api/admin/eligible-vaccines/${childId}`);
      setData(response.data);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to fetch eligibility', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - new Date(dob).getTime();
    const age = new Date(diff);
    const years = Math.abs(age.getUTCFullYear() - 1970);
    const months = age.getUTCMonth();
    const days = age.getUTCDate() - 1;
    
    if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="bg-white rounded-xl p-6 mb-8">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const eligibleVaccines = data?.vaccines.filter(v => v.eligible) || [];
  const notEligibleVaccines = data?.vaccines.filter(v => !v.eligible) || [];

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-8 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
            {data?.child.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{data?.child.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-purple-100">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(data?.child.dateOfBirth).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {calculateAge(data?.child.dateOfBirth)} old
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-green-500 rounded"></span>
          Eligible Vaccines
        </h2>
        {eligibleVaccines.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No eligible vaccines at this time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleVaccines.map(vaccine => (
              <div key={vaccine._id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-2 border-green-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{vaccine.name}</h3>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                        Eligible
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{vaccine.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min Age:</span>
                    <span className="font-medium text-gray-700">{vaccine.minAgeValue} {vaccine.minAgeUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Doses:</span>
                    <span className="font-medium text-gray-700">{vaccine.totalDoses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gap:</span>
                    <span className="font-medium text-gray-700">{vaccine.gapBetweenDoses} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-gray-400 rounded"></span>
          Not Yet Eligible
        </h2>
        {notEligibleVaccines.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500">All vaccines are eligible!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notEligibleVaccines.map(vaccine => (
              <div key={vaccine._id} className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 opacity-75">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-600">{vaccine.name}</h3>
                      <span className="inline-block px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full mt-1">
                        Not Yet
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{vaccine.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Age:</span>
                    <span className="font-medium text-gray-600">{vaccine.minAgeValue} {vaccine.minAgeUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Doses:</span>
                    <span className="font-medium text-gray-600">{vaccine.totalDoses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildEligibility;
