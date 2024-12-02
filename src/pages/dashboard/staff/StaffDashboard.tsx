import { Routes, Route } from 'react-router-dom';
import {
  faHome,
  faCalendarCheck,
  faBell,
  faUser,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import DashboardLayout from '@/layouts/DashboardLayout';
import Overview from './Overview';
import BookingManagement from './BookingManagement';
import Notifications from './Notifications';
import Profile from './Profile';
import ValidarReservas from './ValidarReservas';

const StaffDashboard = () => {
  const sidebarItems = [
    { icon: faHome, label: 'Vista General', path: '/staff' },
    { icon: faQrcode, label: 'Validar Reservas', path: '/staff/validar-reservas' },
    { icon: faCalendarCheck, label: 'Gestión de Reservas', path: '/staff/bookings' },
    { icon: faUser, label: 'Mi Perfil', path: '/staff/profile' },
    { icon: faBell, label: 'Notificaciones', path: '/staff/notifications' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Panel de Encargado">
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/bookings" element={<BookingManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/validar-reservas" element={<ValidarReservas />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StaffDashboard;