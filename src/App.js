import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar'; // Import the NavigationBar component
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './utilities/AuthContext';
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar /> {/* Include the NavigationBar */}
        <Routes>
          <Route path="/" element={<div>Home Page Placeholder</div>} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
