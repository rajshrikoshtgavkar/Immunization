const axios = require('axios');

// Mock vaccination centers data
const getMockCenters = (lat, lng) => {
  return [
    {
      id: 'gov_1',
      name: 'Sassoon General Hospital',
      address: 'Near Pune Railway Station, Shivajinagar, Pune',
      location: { lat: lat + 0.008, lng: lng + 0.012 },
      rating: 4.3,
      isOpen: true,
      type: 'government',
      distance: 1.5
    },
    {
      id: 'gov_2',
      name: 'Shivajinagar Primary Health Center',
      address: 'JM Road, Shivajinagar, Pune',
      location: { lat: lat - 0.015, lng: lng + 0.008 },
      rating: 4.0,
      isOpen: true,
      type: 'government',
      distance: 2.1
    },
    {
      id: 'priv_1',
      name: 'Ruby Hall Clinic Vaccination Center',
      address: '40, Sassoon Road, Pune',
      location: { lat: lat + 0.018, lng: lng - 0.010 },
      rating: 4.7,
      isOpen: true,
      type: 'private',
      distance: 2.8
    },
    {
      id: 'gov_3',
      name: 'Pune Municipal Corporation Health Center',
      address: 'Deccan Gymkhana, Pune',
      location: { lat: lat - 0.020, lng: lng - 0.015 },
      rating: 4.1,
      isOpen: false,
      type: 'government',
      distance: 3.2
    },
    {
      id: 'priv_2',
      name: 'Jehangir Hospital Immunization Center',
      address: '32, Sassoon Road, Near Pune Railway Station, Pune',
      location: { lat: lat + 0.025, lng: lng + 0.020 },
      rating: 4.8,
      isOpen: true,
      type: 'private',
      distance: 3.9
    },
    {
      id: 'gov_4',
      name: 'Kamala Nehru Hospital',
      address: 'Mangalwar Peth, Pune',
      location: { lat: lat - 0.028, lng: lng + 0.018 },
      rating: 3.9,
      isOpen: true,
      type: 'government',
      distance: 4.2
    },
    {
      id: 'priv_3',
      name: 'Deenanath Mangeshkar Hospital',
      address: 'Erandwane, Pune',
      location: { lat: lat + 0.032, lng: lng - 0.022 },
      rating: 4.6,
      isOpen: true,
      type: 'private',
      distance: 4.7
    }
  ];
};

const findNearbyCenters = async (latitude, longitude, radius = 5000) => {
  const mockCenters = getMockCenters(latitude, longitude);
  return mockCenters.filter(center => center.distance <= radius / 1000);
};

const getCenterDetails = async (placeId) => {
  return {
    id: placeId,
    name: 'Vaccination Center',
    address: 'Address not available',
    phone: 'Not available',
    location: { lat: 0, lng: 0 },
    rating: 0,
    openingHours: [],
    isOpen: null
  };
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

module.exports = {
  findNearbyCenters,
  getCenterDetails
};
