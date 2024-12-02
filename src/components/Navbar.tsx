import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faTimes, 
  faUser, 
  faDownload,
  faPhone,
  faLocationDot,
  faClock,
  faSignOutAlt,
  faUserCircle,
  faCog,
  faCalendarCheck,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user?.rol) return '/dashboard';
    switch (user.rol.toLowerCase()) {
      case 'administrador':
        return '/admin';
      case 'encargado':
        return '/staff';
      case 'cliente':
        return '/client';
      default:
        return '/dashboard';
    }
  };

  const isBookingPage = location.pathname === '/booking';

  const navItems = isBookingPage ? [
    { name: 'Nueva Reserva', href: '/booking' },
    { name: 'Mis Reservas', href: '/client/history' },
  ] : [
    { name: 'Inicio', href: '#' },
    { name: 'Quiénes Somos', href: '#about' },
    { name: 'Nuestras Canchas', href: '#courts' },
    { name: 'Reservas', href: '#booking' },
    { name: 'Contacto', href: '#contact' }
  ];

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          {/* Top Info Bar */}
          <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-gray-200/10">
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                +56 9 54143067
              </span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                Av. Real 1405, Rahue Alto
              </span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Lunes a Domingo: 15:00 - 00:00
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Main Navbar */}
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-emerald-600 dark:text-emerald-400' : 'text-white'}`}>
                Matices
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium hover:text-emerald-500 transition-colors ${
                    isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                  >
                    <FontAwesomeIcon icon={faUserCircle} />
                    <span>{user?.nombre}</span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                      >
                        <Link
                          to={getDashboardLink()}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon icon={faCog} className="mr-2" />
                          Mi Panel
                        </Link>
                        <Link
                          to="/booking"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                          Nueva Reserva
                        </Link>
                        <Link
                          to="/client/history"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon icon={faHistory} className="mr-2" />
                          Mis Reservas
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Iniciar Sesión</span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Descargar App</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-2xl"
            >
              <FontAwesomeIcon 
                icon={isOpen ? faTimes : faBars} 
                className={isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                        onClick={() => setIsOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUserCircle} />
                        <span>Mi Panel</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-center space-x-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      <span>Iniciar Sesión</span>
                    </button>
                  )}
                  <button className="flex items-center justify-center space-x-2 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition">
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Descargar App</span>
                  </button>
                  <div className="pt-4">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;