const { findNearbyCenters, getCenterDetails } = require('../services/vaccinationCenterService');

// @desc    Find nearby vaccination centers
// @route   GET /api/centers/nearby
// @access  Protected (Parent)
exports.getNearbyCenters = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = radius ? parseInt(radius) : 5000;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const centers = await findNearbyCenters(latitude, longitude, searchRadius);

    res.status(200).json({
      success: true,
      count: centers.length,
      data: centers
    });
  } catch (error) {
    console.error('Error in getNearbyCenters:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to find nearby centers'
    });
  }
};

// @desc    Get vaccination center details
// @route   GET /api/centers/:placeId
// @access  Protected (Parent)
exports.getCenterDetails = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: 'Place ID is required'
      });
    }

    const centerDetails = await getCenterDetails(placeId);

    res.status(200).json({
      success: true,
      data: centerDetails
    });
  } catch (error) {
    console.error('Error in getCenterDetails:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get center details'
    });
  }
};
