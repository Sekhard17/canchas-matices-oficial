import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BookingPage from '@/pages/booking/BookingPage';
import AdminDashboard from '@/pages/dashboard/admin/AdminDashboard';
import StaffDashboard from '@/pages/dashboard/staff/StaffDashboard';
import ClientDashboard from '@/pages/dashboard/client/ClientDashboard';
import AuthGuard from '@/components/AuthGuard';

function App() {
  const { checkAuth, isAuthenticated, user } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return '/login';

    switch (user.rol) {
      case 'Administrador':
        return '/admin';
      case 'Encargado':
        return '/staff';
      case 'Cliente':
        return '/client';
      default:
        return '/login';
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="matices-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/booking" 
            element={
              <AuthGuard>
                <BookingPage />
              </AuthGuard>
            } 
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AuthGuard allowedRoles={['Administrador']}>
                <AdminDashboard />
              </AuthGuard>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/*"
            element={
              <AuthGuard allowedRoles={['Encargado']}>
                <StaffDashboard />
              </AuthGuard>
            }
          />

          {/* Client Routes */}
          <Route
            path="/client/*"
            element={
              <AuthGuard allowedRoles={['Cliente']}>
                <ClientDashboard />
              </AuthGuard>
            }
          />

          {/* Dashboard Redirect */}
          <Route
            path="/dashboard"
            element={<Navigate to={getDashboardRoute()} replace />}
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }} 
      />
    </ThemeProvider>
  );
}

export default App;