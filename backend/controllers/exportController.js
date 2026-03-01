const exportService = require('../services/exportService');
const Vaccine = require('../models/Vaccine');

// @desc    Export vaccine report as CSV
// @route   GET /api/admin/reports/vaccine/:vaccineId/export
// @access  Admin only
exports.exportVaccineReport = async (req, res) => {
  try {
    const { vaccineId } = req.params;

    // Validate vaccine exists
    const vaccine = await Vaccine.findById(vaccineId);
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }

    // Get export data
    const data = await exportService.getVaccineExportData(vaccineId);

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'No vaccination records found for this vaccine' });
    }

    // Generate CSV
    const csv = exportService.generateCSV(data);

    // Set headers for file download
    const filename = `${vaccine.name.replace(/\s+/g, '_')}_Report_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.status(200).send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export report', error: error.message });
  }
};

module.exports = exports;
