import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const PharmacistHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 py-[15px] border-b border-gray-200 drop-shadow-sm bg-white flex items-center justify-between">
      {/* Left spacer */}
      <div className="w-1/4" />

      {/* Search bar in the center */}
      <div className="w-1/2 flex items-center max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notification + Logout */}
      <div className="w-1/4 flex items-center justify-end space-x-4">
        <button
          className="text-gray-600 hover:text-blue-600 transition duration-200"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default PharmacistHeader;