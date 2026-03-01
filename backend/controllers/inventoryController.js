const Vaccine = require('../models/Vaccine');
const VaccinationRecord = require('../models/VaccinationRecord');
const Child = require('../models/Child');

// @desc    Get vaccine inventory with stock details
// @route   GET /api/admin/vaccine-stock
// @access  Admin
exports.getVaccineInventory = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ isActive: true });
    
    const inventoryData = await Promise.all(
      vaccines.map(async (vaccine) => {
        const usedDoses = await VaccinationRecord.countDocuments({
          vaccine: vaccine._id,
          status: 'TAKEN'
        });

        const upcomingDoses = await VaccinationRecord.countDocuments({
          vaccine: vaccine._id,
          status: 'UPCOMING',
          doseDate: {
            $gte: new Date(),
            $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });

        const remainingStock = vaccine.totalStock - usedDoses;
        const stockStatus = remainingStock <= 0 ? 'Critical' 
          : remainingStock <= vaccine.minStockThreshold ? 'Low' 
          : 'Sufficient';

        const daysUntilExpiry = vaccine.expiryDate 
          ? Math.ceil((new Date(vaccine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
          : null;

        const alerts = [];
        if (stockStatus === 'Critical') alerts.push('Critical Stock');
        if (stockStatus === 'Low') alerts.push('Low Stock');
        if (daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          alerts.push('Expiring Soon');
        }
        if (daysUntilExpiry !== null && daysUntilExpiry <= 0) {
          alerts.push('Expired');
        }

        return {
          _id: vaccine._id,
          name: vaccine.name,
          manufacturer: vaccine.manufacturer,
          doseType: vaccine.doseType,
          totalDoses: vaccine.totalDoses,
          expiryDate: vaccine.expiryDate,
          totalStock: vaccine.totalStock,
          usedStock: usedDoses,
          remainingStock,
          upcomingDemand: upcomingDoses,
          minStockThreshold: vaccine.minStockThreshold,
          stockStatus,
          alerts,
          daysUntilExpiry
        };
      })
    );

    const summary = {
      totalVaccines: inventoryData.length,
      totalAvailableDoses: inventoryData.reduce((sum, v) => sum + v.remainingStock, 0),
      lowStockVaccines: inventoryData.filter(v => v.stockStatus === 'Low' || v.stockStatus === 'Critical').length,
      criticalStockVaccines: inventoryData.filter(v => v.stockStatus === 'Critical').length,
      expiringVaccines: inventoryData.filter(v => v.daysUntilExpiry !== null && v.daysUntilExpiry <= 30 && v.daysUntilExpiry > 0).length
    };

    res.status(200).json({
      success: true,
      summary,
      data: inventoryData
    });
  } catch (error) {
    console.error('Inventory fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vaccine stock
// @route   PUT /api/admin/vaccine-stock/:vaccineId
// @access  Admin
exports.updateVaccineStock = async (req, res) => {
  try {
    const { totalStock, manufacturer, doseType, expiryDate, minStockThreshold } = req.body;
    
    const vaccine = await Vaccine.findById(req.params.vaccineId);
    if (!vaccine) {
      return res.status(404).json({ success: false, message: 'Vaccine not found' });
    }

    if (totalStock !== undefined) vaccine.totalStock = totalStock;
    if (manufacturer !== undefined) vaccine.manufacturer = manufacturer;
    if (doseType !== undefined) vaccine.doseType = doseType;
    if (expiryDate !== undefined) vaccine.expiryDate = expiryDate;
    if (minStockThreshold !== undefined) vaccine.minStockThreshold = minStockThreshold;

    await vaccine.save();

    res.status(200).json({
      success: true,
      message: 'Vaccine stock updated successfully',
      data: vaccine
    });
  } catch (error) {
    console.error('Stock update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get stock alerts
// @route   GET /api/admin/vaccine-stock/alerts
// @access  Admin
exports.getStockAlerts = async (req, res) => {
  try {
    const vaccines = await Vaccine.find({ isActive: true });
    
    const alerts = [];

    for (const vaccine of vaccines) {
      const usedDoses = await VaccinationRecord.countDocuments({
        vaccine: vaccine._id,
        status: 'TAKEN'
      });

      const remainingStock = vaccine.totalStock - usedDoses;
      const daysUntilExpiry = vaccine.expiryDate 
        ? Math.ceil((new Date(vaccine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

      if (remainingStock <= 0) {
        alerts.push({
          type: 'Critical Stock',
          severity: 'critical',
          vaccine: vaccine.name,
          message: `${vaccine.name} is out of stock`,
          remainingStock
        });
      } else if (remainingStock <= vaccine.minStockThreshold) {
        alerts.push({
          type: 'Low Stock',
          severity: 'warning',
          vaccine: vaccine.name,
          message: `${vaccine.name} stock is below threshold (${remainingStock} remaining)`,
          remainingStock
        });
      }

      if (daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        alerts.push({
          type: 'Expiring Soon',
          severity: 'warning',
          vaccine: vaccine.name,
          message: `${vaccine.name} expires in ${daysUntilExpiry} days`,
          daysUntilExpiry
        });
      }

      if (daysUntilExpiry !== null && daysUntilExpiry <= 0) {
        alerts.push({
          type: 'Expired',
          severity: 'critical',
          vaccine: vaccine.name,
          message: `${vaccine.name} has expired`,
          daysUntilExpiry
        });
      }
    }

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Alerts fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
