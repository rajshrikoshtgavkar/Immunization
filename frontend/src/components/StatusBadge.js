import React from 'react';

const StatusBadge = ({ status, text }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'active':
      case 'success':
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      
      case 'pending':
      case 'scheduled':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      
      case 'overdue':
      case 'missed':
      case 'critical':
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      
      case 'closed':
      case 'inactive':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {text || status}
    </span>
  );
};

export default StatusBadge;
