import React from 'react';
import { Outlet } from 'react-router-dom';
import PharmacistSidebar from '../components/PharmacistSidebar'; // adjust path as needed
import PharmacistHeader from '../components/PharmacistHeader'; // adjust path as needed

const PharmacistLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <PharmacistSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <PharmacistHeader />

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PharmacistLayout;