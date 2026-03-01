import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParentLayout from '../components/ParentLayout';
import { getChildCertificate } from '../api/certificateApi';

const VaccinationCertificate = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertificate();
  }, [childId]);

  const fetchCertificate = async () => {
    try {
      const data = await getChildCertificate(childId);
      setCertificate(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

  if (error) {
    return (
      <ParentLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center py-16"
        >
          <svg className="w-20 h-20 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/parent/children')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Back to Children
          </button>
        </motion.div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => navigate('/parent/children')}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Certificate
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-green-100 p-12 print:shadow-none print:border-2"
        >
          <div className="border-8 border-double border-green-600 p-8 rounded-2xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-black text-gray-800 mb-2">VACCINATION CERTIFICATE</h1>
              <p className="text-lg text-gray-600 font-semibold">{certificate.issuedBy}</p>
              <div className="mt-4 inline-block px-4 py-2 bg-green-100 rounded-lg">
                <p className="text-sm text-gray-600">Certificate ID</p>
                <p className="text-xs font-mono font-bold text-green-700">{certificate.certificateId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 border-b-2 border-green-500 pb-2">Child Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Full Name</p>
                    <p className="text-lg font-bold text-gray-800">{certificate.child.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Date of Birth</p>
                    <p className="text-lg font-bold text-gray-800">{new Date(certificate.child.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Gender</p>
                    <p className="text-lg font-bold text-gray-800 capitalize">{certificate.child.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Child ID</p>
                    <p className="text-xs font-mono font-bold text-gray-700">{certificate.child.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-800 border-b-2 border-green-500 pb-2">Parent/Guardian Details</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Name</p>
                    <p className="text-lg font-bold text-gray-800">{certificate.parent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">Contact Email</p>
                    <p className="text-lg font-bold text-gray-800">{certificate.parent.email}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="text-center">
                    <img src={certificate.qrCode} alt="QR Code" className="w-32 h-32 mx-auto border-2 border-gray-300 rounded-lg" />
                    <p className="text-xs text-gray-500 mt-2 font-semibold">Scan to Verify</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-gray-800 border-b-2 border-green-500 pb-2 mb-4">Vaccination Records</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="px-4 py-3 text-left text-sm font-black text-gray-700 border border-green-200">Vaccine Name</th>
                      <th className="px-4 py-3 text-left text-sm font-black text-gray-700 border border-green-200">Dose Number</th>
                      <th className="px-4 py-3 text-left text-sm font-black text-gray-700 border border-green-200">Date of Vaccination</th>
                      <th className="px-4 py-3 text-left text-sm font-black text-gray-700 border border-green-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificate.vaccinations.map((vac, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 border border-gray-200">{vac.vaccineName}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 border border-gray-200">{vac.doseNumber}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800 border border-gray-200">{new Date(vac.dateOfVaccination).toLocaleDateString()}</td>
                        <td className="px-4 py-3 border border-gray-200">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            {vac.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Issue Date:</span> {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500 italic">
                This is a digitally generated certificate. Verify authenticity by scanning the QR code.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </ParentLayout>
  );
};

export default VaccinationCertificate;
