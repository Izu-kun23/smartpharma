import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import StartPage from './pages/StartPage';
import AdminLogin from './pages/admin/AdminLogin';
import PharmacistLogin from './pages/pharmacist/PharmacistLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './layout/adminLayout'; // adjust path if needed
import PharmacistLayout from './layout/pharmacistLayout'; // adjust path if needed
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard'; // create this page if needed
import PharmacistCategory from './pages/pharmacist/PharmacistCategory';
import PharmacyList from './pages/admin/PharmacyList';
import AddPharmacy from './pages/admin/AddPharmacy';
import AdminUserList from './pages/admin/AdminUserList';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StartPage />} />

        {/* Admin Auth */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pharmacy-list" element={<PharmacyList />} />
          <Route path="add-pharmacy" element={<AddPharmacy />} />
          <Route path="user-list" element={<AdminUserList />} />

          {/* Add more admin child routes here */}
        </Route>

        {/* Pharmacist Auth */}
        <Route path="/pharmacist-login" element={<PharmacistLogin />} />

        {/* Pharmacist Protected Routes */}
        <Route path="/pharmacist" element={<PharmacistLayout />}>
          <Route path="dashboard" element={<PharmacistDashboard />} />
          <Route path="categories" element={<PharmacistCategory />} />
          {/* Add more pharmacist child routes here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;