const VaccinationRecord = require('../models/VaccinationRecord');
const Child = require('../models/Child');
const User = require('../models/User');
const Vaccine = require('../models/Vaccine');

// Get vaccination data for a specific vaccine (for export)
exports.getVaccineExportData = async (vaccineId) => {
  try {
    const records = await VaccinationRecord.find({ vaccine: vaccineId })
      .populate({
        path: 'child',
        select: 'name dateOfBirth',
        populate: {
          path: 'parent',
          select: 'name email'
        }
      })
      .populate('vaccine', 'name')
      .sort({ dateAdministered: -1 })
      .lean();

    return records.map(record => ({
      vaccineName: record.vaccine?.name || 'N/A',
      childName: record.child?.name || 'N/A',
      childId: record.child?._id || 'N/A',
      parentName: record.child?.parent?.name || 'N/A',
      parentEmail: record.child?.parent?.email || 'N/A',
      doseNumber: record.doseNumber || 1,
      dateAdministered: record.dateAdministered ? new Date(record.dateAdministered).toLocaleDateString('en-IN') : 'N/A',
      status: record.status || 'Completed',
      notes: record.notes || ''
    }));
  } catch (error) {
    throw new Error('Failed to fetch vaccine export data: ' + error.message);
  }
};

// Generate CSV content
exports.generateCSV = (data) => {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = [
    'Vaccine Name',
    'Child Name',
    'Child ID',
    'Parent Name',
    'Parent Email',
    'Dose Number',
    'Date Administered',
    'Status',
    'Notes'
  ];

  const csvRows = [headers.join(',')];

  data.forEach(row => {
    const values = [
      row.vaccineName,
      row.childName,
      row.childId,
      row.parentName,
      row.parentEmail,
      row.doseNumber,
      row.dateAdministered,
      row.status,
      row.notes
    ].map(value => `"${String(value).replace(/"/g, '""')}"`);
    
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

module.exports = exports;
