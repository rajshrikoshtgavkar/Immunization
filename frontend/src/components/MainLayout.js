import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import ParentNavbar from './ParentNavbar';
import GovernmentFooter from './GovernmentFooter';

const MainLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 flex flex-col">
      {user?.role === 'admin' ? <Navbar /> : <ParentNavbar />}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <GovernmentFooter />
    </div>
  );
};

export default MainLayout;
