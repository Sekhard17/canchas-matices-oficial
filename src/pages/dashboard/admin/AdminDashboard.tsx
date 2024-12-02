import { Routes, Route } from 'react-router-dom';
import {
  faHome,
  faUsers,
  faFutbol,
  faChartLine,
  faCalendarCheck,
  faUser,
  faQrcode,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import DashboardLayout from '@/layouts/DashboardLayout';
import Overview from './Overview';
import UserManagement from './UserManagement';
import CourtManagement from './CourtManagement';
import Settings from './Settings';
import Bookings from './Bookings';
import Reports from './Reports';
import Profile from './Profile';
import ValidarReservas from './ValidarReservas';
import SolicitudesPage from './SolicitudesPage';

const AdminDashboard = () => {
  const sidebarItems = [
    { icon: faHome, label: 'Vista General', path: '/admin' },
    { icon: faUsers, label: 'Usuarios', path: '/admin/users' },
    { icon: faFutbol, label: 'Canchas', path: '/admin/courts' },
    { icon: faCalendarCheck, label: 'Reservas', path: '/admin/bookings' },
    { icon: faQrcode, label: 'Validar Reservas', path: '/admin/validar-reservas' },
    { icon: faClipboardList, label: 'Solicitudes', path: '/admin/solicitudes' },
    { icon: faChartLine, label: 'Reportes', path: '/admin/reports' },
    { icon: faUser, label: 'Mi Perfil', path: '/admin/profile' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Panel de Administración">
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/courts" element={<CourtManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/validar-reservas" element={<ValidarReservas />} />
        <Route path="/solicitudes" element={<SolicitudesPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;