import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, UserCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOutAdmin } from "../../../server/controllers/AdminController"; // Adjust the import path as necessary

const AdminHeader = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      localStorage.removeItem("adminUser");
      toast.success("You have been logged out.");
      navigate("/admin-login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <header className="w-full px-6 py-[15px] border-b border-gray-200 shadow-sm bg-white flex items-center justify-between relative">
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

        {/* Notifications + Profile */}
        <div className="w-1/4 flex items-center justify-end space-x-4 relative">
          <button
            className="text-gray-600 hover:text-blue-600 transition duration-200"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          {adminData ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 hover:bg-blue-100 transition duration-200"
              >
                <UserCircle className="w-5 h-5" />
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <div className="px-4 py-3">
                      <p className="text-gray-800 font-semibold">
                        {adminData.name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {adminData.role}
                      </p>
                    </div>
                    <hr className="border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-200"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/admin-login")}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* ToastContainer for react-toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </>
  );
};

export default AdminHeader;