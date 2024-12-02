import { Routes, Route } from 'react-router-dom';
import {
  faHome,
  faCalendarPlus,
  faHistory,
  faUser,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import DashboardLayout from '@/layouts/DashboardLayout';
import Overview from './Overview';
import BookingHistory from './BookingHistory';
import Receipts from './Receipts';
import Profile from './Profile';
import Notifications from './Notifications';

const ClientDashboard = () => {
  const sidebarItems = [
    { icon: faHome, label: 'Inicio', path: '/client' },
    { icon: faCalendarPlus, label: 'Nueva Reserva', path: '/booking' },
    { icon: faHistory, label: 'Mis Reservas', path: '/client/history' },
    { icon: faUser, label: 'Mi Perfil', path: '/client/profile' },
    { icon: faBell, label: 'Notificaciones', path: '/client/notifications' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Mi Panel">
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;