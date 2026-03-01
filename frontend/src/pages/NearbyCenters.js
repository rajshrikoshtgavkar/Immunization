import React, { useState, useEffect } from 'react';
import ParentLayout from '../components/ParentLayout';
import { getNearbyCenters } from '../api/centerApi';

const NearbyCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [radiusFilter, setRadiusFilter] = useState(5000);

  // Dummy location (Shivajinagar, Pune, India)
  const DUMMY_LOCATION = { lat: 18.5304, lng: 73.8567 };

  useEffect(() => {
    fetchNearbyCenters(DUMMY_LOCATION.lat, DUMMY_LOCATION.lng, radiusFilter);
  }, []);

  const fetchNearbyCenters = async (lat, lng, radius) => {
    try {
      setLoading(true);
      const data = await getNearbyCenters(lat, lng, radius);
      setCenters(data.data);
    } catch (err) {
      console.error('Error fetching centers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadiusFilter(newRadius);
    fetchNearbyCenters(DUMMY_LOCATION.lat, DUMMY_LOCATION.lng, newRadius);
  };

  const openDirections = (center) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <ParentLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Nearby Vaccination Centers
          </h1>
          <p className="text-gray-600">Find vaccination centers and hospitals near your location</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Search Radius:</label>
          <div className="flex gap-2">
            {[2000, 5000, 10000, 15000].map(radius => (
              <button
                key={radius}
                onClick={() => handleRadiusChange(radius)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  radiusFilter === radius
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {radius / 1000} km
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding nearby centers...</p>
            </div>
          </div>
        ) : centers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600">No vaccination centers found nearby</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <div
                key={center.id}
                className={`bg-white border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer ${
                  selectedCenter?.id === center.id ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
                onClick={() => setSelectedCenter(center)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    center.type === 'government' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-7 h-7 ${
                      center.type === 'government' ? 'text-green-600' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{center.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded inline-block ${
                      center.type === 'government' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {center.type === 'government' ? 'Government' : 'Private'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{center.address}</p>
                
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="font-semibold">{center.distance} km</span>
                  </div>
                  
                  {center.rating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span>{center.rating}</span>
                    </div>
                  )}
                  
                  {center.isOpen !== null && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      center.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {center.isOpen ? 'Open' : 'Closed'}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirections(center);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
};

export default NearbyCenters;
