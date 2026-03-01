import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ParentsList from './pages/admin/ParentsList';
import ParentDetail from './pages/admin/ParentDetail';
import VaccinesList from './pages/admin/VaccinesList';
import ChildEligibility from './pages/admin/ChildEligibility';
import AlertsList from './pages/admin/AlertsList';
import CreateAlert from './pages/admin/CreateAlert';
import ParentAlerts from './pages/ParentAlerts';
import ParentChildren from './pages/ParentChildren';
import RecordFirstDose from './pages/admin/RecordFirstDose';
import VaccinationSchedule from './pages/admin/VaccinationSchedule';
import AdminReports from './pages/admin/AdminReports';
import VaccinationCertificate from './pages/VaccinationCertificate';
import VaccineInventory from './pages/admin/VaccineInventory';
import SMSLogs from './pages/admin/SMSLogs';
import HealthAdvisory from './pages/HealthAdvisory';
import MedicalChatbot from './pages/MedicalChatbot';
import NearbyCenters from './pages/NearbyCenters';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/parent/dashboard'} /> : <Login />} 
      />

      {/* Admin Routes - All wrapped in MainLayout */}
      <Route element={<PrivateRoute allowedRoles={['admin']}><MainLayout /></PrivateRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/parents" element={<ParentsList />} />
        <Route path="/admin/parents/:id" element={<ParentDetail />} />
        <Route path="/admin/vaccines" element={<VaccinesList />} />
        <Route path="/admin/child-eligibility/:childId" element={<ChildEligibility />} />
        <Route path="/admin/alerts" element={<AlertsList />} />
        <Route path="/admin/alerts/create" element={<CreateAlert />} />
        <Route path="/admin/vaccinations/first-dose" element={<RecordFirstDose />} />
        <Route path="/admin/vaccinations/:childId" element={<VaccinationSchedule />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/sms-logs" element={<SMSLogs />} />
        <Route path="/admin/inventory" element={<VaccineInventory />} />
      </Route>

      {/* Parent Routes - All wrapped in MainLayout */}
      <Route element={<PrivateRoute allowedRoles={['parent']}><MainLayout /></PrivateRoute>}>
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/alerts" element={<ParentAlerts />} />
        <Route path="/parent/children" element={<ParentChildren />} />
        <Route path="/parent/vaccinations/:childId" element={<VaccinationSchedule />} />
        <Route path="/parent/certificate/:childId" element={<VaccinationCertificate />} />
        <Route path="/parent/health-advisory" element={<HealthAdvisory />} />
        <Route path="/parent/ai-chat" element={<MedicalChatbot />} />
        <Route path="/parent/nearby-centers" element={<NearbyCenters />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
