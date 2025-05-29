import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <main className="flex flex-col items-center justify-center flex-grow p-2 mt-[-70px]">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-blue-600 mb-12 tracking-tight"
        >
          Smart Pharma
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-700 mb-12 text-center max-w-2xl"
        >
          Welcome to Smart Pharma, your comprehensive solution for managing pharmacy operations efficiently.
          Choose your role to get started.
        </motion.p>

        <div className="flex flex-col md:flex-row gap-14">
          {/* Administrator Card */}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 12px 30px rgba(59, 130, 246, 0.3)',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer bg-white rounded-3xl p-10 w-80 text-center shadow-lg hover:border-2 hover:border-blue-600 transition-all duration-300"
            onClick={() => navigate('/admin-login')}
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Administrator</h2>
            <p className="text-base text-gray-600">Access tools to manage users, settings, and reports.</p>
          </motion.div>

          {/* Pharmacist Card */}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: '0 12px 30px rgba(34, 197, 94, 0.3)',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="cursor-pointer bg-white rounded-3xl p-10 w-80 text-center shadow-lg hover:border-2 hover:border-green-600 transition-all duration-300"
            onClick={() => navigate('/pharmacist-login')}
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Pharmacist</h2>
            <p className="text-base text-gray-600">Handle prescriptions, inventory, and patient requests.</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StartPage;