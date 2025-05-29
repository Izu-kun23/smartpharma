import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, UserCircle, ChevronDown } from 'lucide-react';
import useAuth from '../../../server/utils/useAuth';
import { logoutUser, fetchAllCategories } from '../../../server/fire';

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How it Works' },
  { to: '/products', label: 'Products' }, // dropdown attaches here
  { to: '/services', label: 'Services' },
  { to: '/contacts', label: 'Contacts' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catDropdown, setCatDropdown] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    if (success) {
      setDropdownOpen(false);
      navigate('/login');
    } else {
      console.error('Logout failed:', error.message);
      alert('Logout failed: ' + error.message);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      const { success, categories } = await fetchAllCategories();
      if (success) setCategories(categories);
    };
    getCategories();
  }, []);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-blue-500 font-bold text-2xl">
          <Link to="/">Smart Pharma</Link>
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium relative">
          {links.map(({ to, label }) => {
            const isActive = location.pathname === to;
            const isProduct = label === 'Products';

            return (
              <li
                key={to}
                className="relative cursor-pointer"
                onClick={() => isProduct && setCatDropdown((prev) => !prev)}
              >
                <div className="flex items-center space-x-1">
                  <Link
                    to={to}
                    className="relative px-1 py-1 inline-block hover:text-blue-600 transition-colors duration-200"
                  >
                    {label}
                    <motion.div
                      initial={{ width: isActive ? '100%' : 0 }}
                      animate={{ width: isActive ? '100%' : 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="absolute left-0 bottom-0 h-[2px] bg-blue-500"
                      style={{ borderRadius: '2px' }}
                    />
                  </Link>
                  {isProduct && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        catDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>

                {/* Product Categories Dropdown */}
                {isProduct && catDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${encodeURIComponent(cat.name)}`}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                          onClick={() => setCatDropdown(false)}
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-400">No categories</div>
                    )}
                    <hr />
                    <Link
                      to="/products"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setCatDropdown(false)}
                    >
                      Show All Products
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Icons + Auth */}
        <div className="flex items-center space-x-4 relative">
          <button className="p-2 rounded-full hover:bg-blue-100 transition">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-blue-600">
              <Search size={18} />
            </div>
          </button>

          <button className="p-2 rounded-full hover:bg-blue-100 transition">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-blue-600">
              <ShoppingCart size={18} />
            </div>
          </button>

          {!loading && user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
              >
                <UserCircle size={23} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <div className="px-4 py-2 text-gray-700 border-b">👋 {user.fullName}</div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;