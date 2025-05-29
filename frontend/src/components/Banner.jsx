import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import pharmacistImg from '../assets/pharmacist.png'; // adjust path as needed

const Banner = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-blue-200 text-white py-0 px-6 md:px-14 mb-2 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between"
    >
      {/* Text content */}
      <div className="max-w-xl mb-10 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight drop-shadow-lg text-black">
          Smarter Way to Find Medicines Near You
        </h1>
        <p className="text-base md:text-lg mb-8 leading-relaxed drop-shadow-sm text-gray-500 max-w-md">
          Locate pharmacies by distance, compare products, and get instant access to medication .
        </p>
        <button className="bg-blue-600 text-gray-200 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-blue-100 hover:text-blue-600 transition duration-300 transform hover:scale-105 flex items-center gap-2">
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={pharmacistImg}
          alt="Healthcare"
          className="rounded-xl max-w-full h-auto"
          loading="lazy"
        />
      </div>
    </motion.section>
  );
};

export default Banner;