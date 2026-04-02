import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import SignAProbationContractPage from './pages/SignAProbationContractPage';
import ViewProbationContractPage from './pages/ViewProbationContractPage';
import './style/employee-management.css';

// Main App component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user was previously logged in
    const wasLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (wasLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberedUsername');
    localStorage.removeItem('rememberMe');
    setIsLoggedIn(false);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Sign Probation Contract Pages - No Auth Required */}
        <Route path="/signAProbationContract/:contractCode" element={<SignAProbationContractPage />} />
        <Route path="/viewProbationContract/:contractCode" element={<ViewProbationContractPage />} />

        {/* Main Application Routes */}
        <Route
          path="/*"
          element={
            !isLoggedIn ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            ) : (
              <EmployeeManagementPage onLogout={handleLogout} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
