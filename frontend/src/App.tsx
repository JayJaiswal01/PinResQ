import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { HomeScreen } from './pages/home-screen';
import { MapScreen } from './pages/map-screen';
import { ProfileScreen } from './pages/profile-screen';
import { RewardsScreen } from './pages/rewards-screen';
import { ReportAccidentScreen } from './pages/report-accident-screen';
import { VerificationStatusScreen } from './pages/verification-status-screen';
import { Layout } from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const userId = localStorage.getItem('userId');
  return userId ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with Bottom Navigation */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<HomeScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/rewards" element={<RewardsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>

        {/* Full screen Protected Routes */}
        <Route 
          path="/report" 
          element={<PrivateRoute><ReportAccidentScreen /></PrivateRoute>} 
        />
        <Route 
          path="/report/status" 
          element={<PrivateRoute><VerificationStatusScreen /></PrivateRoute>} 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}