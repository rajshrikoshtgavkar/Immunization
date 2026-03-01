import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getSMSLogs, sendVaccinationReminders } from '../../api/smsApi';

const SMSLogs = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', messageType: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      const data = await getSMSLogs(filters);
      setLogs(data.data);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to fetch SMS logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminders = async () => {
    if (!window.confirm('Send vaccination reminders to all eligible parents?')) return;
    
    setSending(true);
    try {
      const result = await sendVaccinationReminders();
      alert(result.message);
      fetchLogs();
    } catch (error) {
      alert('Failed to send reminders');
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      SENT: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
      PENDING: 'bg-yellow-100 text-yellow-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getMessageTypeLabel = (type) => {
    const labels = {
      VACCINATION_REMINDER: 'Vaccination Reminder',
      ELIGIBILITY_ALERT: 'Eligibility Alert',
      DOSE_COMPLETION: 'Dose Completion',
      LOW_STOCK_ALERT: 'Low Stock Alert'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">SMS Notification Logs</h1>
            <p className="text-sm text-gray-500 mt-1">View and audit SMS notifications sent to parents</p>
          </div>
          <button
            onClick={handleSendReminders}
            disabled={sending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm font-medium"
          >
            {sending ? 'Sending...' : 'Send Reminders'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total SMS', value: summary.total || 0, color: 'blue' },
            { label: 'Sent', value: summary.sent || 0, color: 'green' },
            { label: 'Failed', value: summary.failed || 0, color: 'red' },
            { label: 'Pending', value: summary.pending || 0, color: 'yellow' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-3xl font-semibold text-${stat.color}-600 mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
              <select
                value={filters.messageType}
                onChange={(e) => setFilters({ ...filters, messageType: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="VACCINATION_REMINDER">Vaccination Reminder</option>
                <option value="ELIGIBILITY_ALERT">Eligibility Alert</option>
                <option value="DOSE_COMPLETION">Dose Completion</option>
                <option value="LOW_STOCK_ALERT">Low Stock Alert</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date & Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Recipient</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Message</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Child</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vaccine</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No SMS logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(log.sentAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {log.maskedNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getMessageTypeLabel(log.messageType)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {log.message}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.child?.name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.vaccine?.name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SMSLogs;
