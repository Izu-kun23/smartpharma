import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader'; // ✅ import header

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area with header */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <div className="p-6 flex-1">
          <Outlet /> {/* This renders the nested route components */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;