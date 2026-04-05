import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import InventoryPage from './pages/InventoryPage';
import WardsPage from './pages/WardsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import AuditPage from './pages/AuditPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import { useAuth } from './context/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  const roleRedirects: Record<string, string> = {
    Admin: '/admin',
    Receptionist: '/reception',
    Doctor: '/doctor',
  };
  
  return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

              <Route element={<AppLayout />}>
                {/* Receptionist routes */}
                <Route
                  path="/"
                  element={<DashboardRedirect />}
                />

                <Route
                  path="/reception"
                  element={
                    <ProtectedRoute allowedRoles={['Receptionist', 'Admin']}>
                      <ReceptionistDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/register" element={<RegisterPage />} />

                {/* Doctor routes */}
                <Route
                  path="/doctor"
                  element={
                    <ProtectedRoute allowedRoles={['Doctor']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Shared management routes (Admin only) */}
                <Route
                  path="/appointments"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <AppointmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <PatientsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctors"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <DoctorsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <InventoryPage />
                    </ProtectedRoute>
                  }
                />

                {/* New Module Routes */}
                <Route
                  path="/wards"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <WardsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emr"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Doctor']}>
                      <PatientProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <AuditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles="Admin">
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Receptionist']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;