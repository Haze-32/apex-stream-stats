import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './utilities/AuthContext';
import UserStats from './components/UserStats';
import "./assets/css/_main.css";
import backgroundImage from './assets/imgs/apex-stats-page-back.jpg'; // Import the image

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  // useLocation hook to get the current path
  const location = useLocation();

  // Conditionally show the NavigationBar
  const shouldShowNavbar = !location.pathname.startsWith("/stats/");
  const backgroundImage = location.pathname.startsWith("/stats/") ? "" : "apexStatsWrap";

  return (
    <div className={backgroundImage} >
      {shouldShowNavbar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/stats/:uid" element={<UserStats />} />
      </Routes>
    </div>
  );
}

export default App;
