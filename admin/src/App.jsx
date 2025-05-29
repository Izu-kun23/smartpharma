import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import StartPage from './pages/StartPage';
import AdminLogin from './pages/admin/AdminLogin';
import PharmacistLogin from './pages/pharmacist/PharmacistLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from '../src/layout/adminLayout'; // adjust the path if needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />

        {/* Admin Auth */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* You can add more admin child routes here like: */}
          {/* <Route path="categories" element={<AdminCategories />} /> */}
        </Route>

        {/* Pharmacist Auth */}
        <Route path="/pharmacist-login" element={<PharmacistLogin />} />
      </Routes>
    </Router>
  );
};

export default App;