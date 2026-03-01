import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/AdminLayout';
import { getVaccineInventory, updateVaccineStock } from '../../api/inventoryApi';

const VaccineInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await getVaccineInventory();
      setInventory(data.data);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = (vaccine) => {
    setSelectedVaccine(vaccine);
    setFormData({
      totalStock: vaccine.totalStock,
      manufacturer: vaccine.manufacturer || '',
      doseType: vaccine.doseType || 'Multiple',
      expiryDate: vaccine.expiryDate ? new Date(vaccine.expiryDate).toISOString().split('T')[0] : '',
      minStockThreshold: vaccine.minStockThreshold
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVaccineStock(selectedVaccine._id, formData);
      setShowModal(false);
      fetchInventory();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sufficient': return 'text-green-700 bg-green-100';
      case 'Low': return 'text-yellow-700 bg-yellow-100';
      case 'Critical': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full"
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h1 className="text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vaccine Inventory
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">Monitor stock levels and manage vaccine availability</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Vaccines', value: summary.totalVaccines || 0, gradient: 'from-cyan-500 to-blue-600', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
            { label: 'Available Doses', value: summary.totalAvailableDoses || 0, gradient: 'from-green-500 to-emerald-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Low Stock', value: summary.lowStockVaccines || 0, gradient: 'from-yellow-500 to-orange-600', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            { label: 'Expiring Soon', value: summary.expiringVaccines || 0, gradient: 'from-red-500 to-pink-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05, type: 'spring' }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
              <div className="relative z-10 text-white">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/80 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-3xl font-black text-gray-800">Inventory Details</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Vaccine Name</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-gray-700">Manufacturer</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Total Stock</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Used</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Remaining</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Upcoming Demand</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Alerts</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.doseType} • {item.totalDoses} doses</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.manufacturer || 'N/A'}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{item.totalStock}</td>
                    <td className="px-6 py-4 text-center font-semibold text-red-600">{item.usedStock}</td>
                    <td className="px-6 py-4 text-center font-bold text-green-600">{item.remainingStock}</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">{item.upcomingDemand}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.stockStatus)}`}>
                        {item.stockStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {item.alerts.map((alert, i) => (
                          <span key={i} className={`px-2 py-1 rounded text-xs font-bold ${
                            alert.includes('Critical') || alert.includes('Expired') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {alert}
                          </span>
                        ))}
                        {item.alerts.length === 0 && <span className="text-xs text-gray-400">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdateStock(item)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all"
                      >
                        Update
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
          >
            <h3 className="text-3xl font-black text-gray-800 mb-6">Update Stock - {selectedVaccine?.name}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Total Stock</label>
                  <input
                    type="number"
                    value={formData.totalStock}
                    onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Min Threshold</label>
                  <input
                    type="number"
                    value={formData.minStockThreshold}
                    onChange={(e) => setFormData({ ...formData, minStockThreshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none font-semibold"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Manufacturer</label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Dose Type</label>
                  <select
                    value={formData.doseType}
                    onChange={(e) => setFormData({ ...formData, doseType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none font-semibold"
                  >
                    <option value="Single">Single</option>
                    <option value="Multiple">Multiple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Update Stock
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default VaccineInventory;
