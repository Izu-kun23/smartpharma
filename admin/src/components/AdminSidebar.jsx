import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  ListOrdered,
  Building2,
  ShoppingCart,
  Settings
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { label: 'Categories', icon: <ListOrdered className="w-5 h-5" />, path: '/admin-categories' },
    { label: 'Products', icon: <Boxes className="w-5 h-5" />, path: '/admin-products' },
    { label: 'Pharmacies', icon: <Building2 className="w-5 h-5" />, path: '/admin-pharmacies' },
    { label: 'Orders', icon: <ShoppingCart className="w-5 h-5" />, path: '/admin-orders' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin-settings' },
  ];

  return (
    <div className="w-68 min-h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Logo Section */}
     <div className="px-1 py-5 border-b border-gray-300 mx-5 flex items-center space-x-4 mb-1">
  <h1 className="text-2xl font-bold text-blue-600 tracking-wide">SmartPharma</h1>
  
  {/* Admin Panel badge with circle styling */}
  <div className="text-gray-600 border border-gray-300 rounded-full px-3 py-1" style={{ fontSize: '10px' }}>
  Admin 
</div>
</div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-[9px] rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition ${
              location.pathname === item.path ? 'bg-blue-100 text-blue-700 font-semibold' : ''
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;