import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import UserRegister from './pages/UserRegister';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Import the Footer

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserRegister />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;