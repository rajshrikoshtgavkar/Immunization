import React, { useState, useEffect } from 'react';
import { analyzeChildHealth, getHealthHistory } from '../api/healthApi';
import { getChildren } from '../api/parentDashboardApi';
import ParentLayout from '../components/ParentLayout';

const HealthAdvisory = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await getChildren();
      setChildren(data.data);
    } catch (err) {
      setError('Failed to load children');
    }
  };

  const fetchHistory = async (childId) => {
    try {
      const data = await getHealthHistory(childId);
      setHistory(data.data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  const handleChildChange = (e) => {
    const childId = e.target.value;
    setSelectedChild(childId);
    setAnalysis(null);
    setShowHistory(false);
    setHistory([]);
    if (childId) {
      fetchHistory(childId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowHistory(false);

    try {
      const data = await analyzeChildHealth(selectedChild, parseFloat(weight), parseFloat(height));
      setAnalysis(data.data);
      fetchHistory(selectedChild);
      setWeight('');
      setHeight('');
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    if (category === 'Underweight') return 'text-orange-700 bg-orange-50 border-orange-200';
    if (category === 'Overweight') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-green-700 bg-green-50 border-green-200';
  };

  const toggleRecord = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  return (
    <ParentLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">AI Health Advisory</h1>
          <p className="text-sm text-gray-600 mt-1">Get personalized health recommendations for your child</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Health Analysis</h2>
                {selectedChild && history.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded hover:bg-teal-100 transition-colors"
                  >
                    {showHistory ? 'New Assessment' : `View History (${history.length})`}
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {!showHistory ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
                      <select
                        value={selectedChild}
                        onChange={handleChildChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">-- Select Child --</option>
                        {children.map(child => (
                          <option key={child._id} value={child._id}>{child.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g., 12.5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="30"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g., 85"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !selectedChild}
                      className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Health'}
                    </button>
                  </form>

                  {analysis && (
                    <div className="mt-6 space-y-4">
                      <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Body Mass Index</p>
                            <p className="text-4xl font-bold text-teal-700">{analysis.assessment.bmi}</p>
                          </div>
                          <div className={`px-6 py-3 rounded-lg border-2 font-semibold text-lg ${getCategoryColor(analysis.assessment.category)}`}>
                            {analysis.assessment.category}
                          </div>
                        </div>
                      </div>

                      {analysis.assessment.missedVaccineWarnings.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
                          <div className="flex items-start gap-3">
                            <div className="bg-red-100 rounded-full p-2">
                              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-red-800 text-lg mb-2">Vaccination Alert</h3>
                              <ul className="text-sm text-red-700 space-y-1">
                                {analysis.assessment.missedVaccineWarnings.map((warning, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    <span>{warning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 rounded-full p-2">
                              <span className="text-2xl">🍎</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">Food Suggestions</h3>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            {analysis.assessment.suggestions.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 rounded-full p-2">
                              <span className="text-2xl">💊</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">Vitamins</h3>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            {analysis.assessment.vitaminRecommendations.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-purple-500 mt-1">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-100 rounded-full p-2">
                              <span className="text-2xl">🛡️</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">Disease Precautions</h3>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            {analysis.assessment.diseasePrecautions.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-orange-500 mt-1">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 rounded-full p-2">
                              <span className="text-2xl">🧼</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-lg">Hygiene & Immunity</h3>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-2">
                            {analysis.assessment.hygieneAdvice.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-blue-800 font-medium">{analysis.disclaimer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No previous assessments found</p>
                    </div>
                  ) : (
                    history.map((record) => (
                      <div key={record._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleRecord(record._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Assessment Date</p>
                                <p className="font-semibold text-gray-800">
                                  {new Date(record.createdAt).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(record.createdAt).toLocaleTimeString('en-IN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                              <div className="border-l border-gray-200 pl-4">
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-2xl font-bold text-teal-700">{record.bmi}</p>
                              </div>
                              <div className={`px-3 py-1 rounded border font-medium text-sm ${getCategoryColor(record.category)}`}>
                                {record.category}
                              </div>
                            </div>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform ${expandedRecord === record._id ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {expandedRecord === record._id && (
                          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Weight</p>
                                <p className="text-lg font-semibold text-gray-800">{record.weight} kg</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Height</p>
                                <p className="text-lg font-semibold text-gray-800">{record.height} cm</p>
                              </div>
                            </div>

                            {record.missedVaccineWarnings && record.missedVaccineWarnings.length > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <h4 className="font-semibold text-red-800 text-sm mb-2">⚠️ Vaccination Alerts</h4>
                                <ul className="text-xs text-red-700 space-y-1">
                                  {record.missedVaccineWarnings.map((warning, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-red-500 mt-0.5">•</span>
                                      <span>{warning}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                <span>🍎</span> Food Suggestions
                              </h4>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {record.suggestions.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                <span>💊</span> Vitamin Recommendations
                              </h4>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {record.vitaminRecommendations.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-0.5">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                <span>🛡️</span> Disease Precautions
                              </h4>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {record.diseasePrecautions.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-0.5">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
                                <span>🧼</span> Hygiene & Immunity
                              </h4>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {record.hygieneAdvice.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">✓</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r p-3">
                              <p className="text-xs text-blue-800">
                                ℹ️ This is an advisory system. Please consult a pediatrician for medical decisions.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ParentLayout>
  );
};

export default HealthAdvisory;
