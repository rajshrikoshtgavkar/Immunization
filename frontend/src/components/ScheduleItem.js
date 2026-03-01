import React from 'react';

const ScheduleItem = ({ record }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-gray-800">Dose {record.doseNumber}</td>
      <td className="px-6 py-4 text-gray-600">
        {new Date(record.doseDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          record.status === 'TAKEN'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {record.status}
        </span>
      </td>
    </tr>
  );
};

export default ScheduleItem;
