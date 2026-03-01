import React from 'react';

const GovernmentFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-white font-semibold mb-3">National Immunization Portal</h3>
            <p className="text-sm text-gray-400">Ministry of Health & Family Welfare</p>
            <p className="text-sm text-gray-400">Government of India</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-400">© {currentYear} National Immunization Portal. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2">Best viewed in Chrome, Firefox, Safari, or Edge browsers</p>
        </div>
      </div>
    </footer>
  );
};

export default GovernmentFooter;
