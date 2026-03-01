import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { AuthContext } from '../../context/AuthContext';
import { getAdminVaccinationSchedule, getParentVaccinationSchedule } from '../../api/vaccinationApi';
import ScheduleItem from '../../components/ScheduleItem';

const VaccinationSchedule = () => {
  const { childId } = useParams();
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchSchedule();
  }, [childId]);

  const fetchSchedule = async () => {
    try {
      const response = user.role === 'admin' 
        ? await getAdminVaccinationSchedule(childId)
        : await getParentVaccinationSchedule(childId);
      
      setRecords(response.data);
      if (response.data.length > 0) {
        setChild(response.data[0].child);
      }
    } catch (error) {
      addToast('Failed to fetch schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const hasCompletedVaccines = records.some(r => r.status === 'TAKEN');

  const handleDownloadCertificate = () => {
    navigate(`/parent/certificate/${childId}`);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const groupedRecords = records.reduce((acc, record) => {
    const vaccineName = record.vaccine.name;
    if (!acc[vaccineName]) acc[vaccineName] = [];
    acc[vaccineName].push(record);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {user.role === 'parent' && hasCompletedVaccines && (
          <button
            onClick={handleDownloadCertificate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Certificate
          </button>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vaccination Schedule</h1>

      {child && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Child Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-800 font-medium">{child.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="text-gray-800 font-medium">{new Date(child.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <p className="text-gray-500">No vaccination records found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecords).map(([vaccineName, vaccineRecords]) => (
            <div key={vaccineName} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">{vaccineName}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dose Number</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vaccineRecords.map(record => (
                      <ScheduleItem key={record._id} record={record} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaccinationSchedule;
