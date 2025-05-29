import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/"); // Redirect to start page
  };

  return (
    <header className="w-full px-6 py-[15px] border-b border-gray-200 shadow-sm bg-white flex items-center justify-between">
      {/* Left spacer */}
      <div className="w-1/4" />

      {/* Search bar with icon */}
      <div className="w-1/2 flex justify-center relative">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>
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
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
