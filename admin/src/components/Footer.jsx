import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-inner p-4 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Smart Pharma. All rights reserved.
    </footer>
  );
};

export default Footer;