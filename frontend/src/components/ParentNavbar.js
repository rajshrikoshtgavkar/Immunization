import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ParentNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/');
  };

  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return 'XXXX-XXXX-XXXX';
    const digits = aadhaar.replace(/\D/g, '');
    if (digits.length === 12) {
      return `XXXX-XXXX-${digits.slice(-4)}`;
    }
    return 'XXXX-XXXX-XXXX';
  };

  const navItems = [
    { path: '/parent/dashboard', label: 'Dashboard' },
    { path: '/parent/children', label: 'My Children' },
    { path: '/parent/alerts', label: 'Notifications' },
    { path: '/parent/nearby-centers', label: 'Nearby Centers' },
    { path: '/parent/health-advisory', label: 'Health Advisory' },
    { path: '/parent/ai-chat', label: 'AI Medical Assistant' }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/parent/dashboard')}>
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">National Immunization Portal</h1>
              <p className="text-xs text-blue-100 font-medium">Citizen Services</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap rounded-md group ${
                  isActive(item.path)
                    ? 'text-white bg-white/20 shadow-sm'
                    : 'text-blue-50 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-t-full"></span>
                )}
              </button>
            ))}
            
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-blue-700 text-sm font-bold shadow-md ring-2 ring-white/30">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <p className="text-base font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wide">Patient</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">{maskAadhaar(user?.aadhaarNumber)}</p>
                    {user?.email && <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 mt-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ParentNavbar;
