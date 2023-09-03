import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './utilities/AuthContext';
import UserStats from './components/UserStats';
import "./App.css"

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

  return (
    <>
      {shouldShowNavbar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<div>Home Page Placeholder</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/stats/:uid" element={<UserStats />} />
      </Routes>
    </>
  );
}

export default App;
