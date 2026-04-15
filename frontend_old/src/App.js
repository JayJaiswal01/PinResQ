import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import HomePage          from './pages/HomePage';
import MapPage           from './pages/MapPage';
import RewardsPage       from './pages/RewardsPage';
import ProfilePage       from './pages/ProfilePage';
import ReportWizardPage  from './pages/ReportWizardPage';
import StatusTrackerPage from './pages/StatusTrackerPage';
import 'leaflet/dist/leaflet.css';
import './App.css';

function PrivateRoute({ children }) {
  const userId = localStorage.getItem('userId');
  return userId ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/dashboard"          element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/map"                element={<PrivateRoute><MapPage /></PrivateRoute>} />
        <Route path="/rewards"            element={<PrivateRoute><RewardsPage /></PrivateRoute>} />
        <Route path="/profile"            element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/report"             element={<PrivateRoute><ReportWizardPage /></PrivateRoute>} />
        <Route path="/report/status/:id"  element={<PrivateRoute><StatusTrackerPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
