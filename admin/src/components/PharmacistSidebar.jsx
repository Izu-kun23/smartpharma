import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  Boxes,
  FileText,
  Settings
} from 'lucide-react';

const PharmacistSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/pharmacist/dashboard' },
    { label: 'Categories', icon: <ListOrdered className="w-5 h-5" />, path: '/pharmacist/categories' },
    { label: 'Products', icon: <Boxes className="w-5 h-5" />, path: '/pharmacist-products' },
    { label: 'Orders', icon: <FileText className="w-5 h-5" />, path: '/pharmacist-orders' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/pharmacist/pharm-settings' },
  ];

  return (
    <div className="w-68 min-h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Logo/Header */}
      <div className="px-1 py-5 border-b border-gray-300 mx-3 flex items-center space-x-4 mb-1">
        <h1 className="text-2xl font-bold text-green-600 tracking-wide">SmartPharma</h1>
        
        {/* Pharmacist Panel badge with circle styling */}
        <div className="text-gray-600 border border-gray-300 rounded-full px-2 py-1" style={{ fontSize: '9px' }}>
          Pharmacist
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-[9px] rounded-lg text-gray-600 hover:bg-green-100 hover:text-green-700 transition ${
              location.pathname === item.path ? 'bg-green-100 text-green-700 font-semibold' : ''
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

export default PharmacistSidebar;