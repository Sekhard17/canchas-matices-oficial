import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSignOutAlt,
  faUser,
  faMoon,
  faSun,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import BottomNavbar from '@/components/navigation/BottomNavbar';

interface SidebarItem {
  icon: any;
  label: string;
  path: string;
}

interface NavItemProps {
  item: SidebarItem;
  isMobile?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  title: string;
}

const DashboardLayout = ({ children, sidebarItems, title }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getModuleByRole = (role?: 'Administrador' | 'Encargado' | 'Cliente'): 'admin' | 'staff' | 'client' => {
    switch (role) {
      case 'Administrador':
        return 'admin';
      case 'Encargado':
        return 'staff';
      case 'Cliente':
      default:
        return 'client';
    }
  };

  const NavItem = ({ item, isMobile = false }: NavItemProps) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
          ${isActive 
            ? 'bg-primary text-primary-foreground dark:text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }
          ${isMobile ? 'flex-col gap-1' : 'w-full'}
        `}
      >
        <div className={`
          ${isMobile ? 'p-2' : 'p-2.5 bg-background/50 rounded-lg'}
          ${isActive ? 'bg-primary-foreground/10' : 'group-hover:bg-background/80'}
          transition-colors duration-300
        `}>
          <FontAwesomeIcon 
            icon={item.icon} 
            className={`${isMobile ? 'text-lg' : 'text-xl'}`}
          />
        </div>
        <span className={`
          ${isMobile ? 'text-[9px]' : 'text-sm font-medium'}
        `}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <AnimatePresence mode="wait">
        {!isMobile && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
          >
            <div className="h-full px-4 py-6 overflow-y-auto bg-card/50 backdrop-blur-xl border-r border-border w-72">
              <div className="flex items-center justify-between mb-8 px-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                  Matices
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <NavItem key={index} item={item} />
                ))}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card/50 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </button>
                </div>
                {user && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 backdrop-blur-sm">
                    <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-xl text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium truncate">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.correo}
                      </p>
                      <p className="text-sm text-primary truncate">
                        {user.rol}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bottom Navigation for mobile */}
      {isMobile && user?.rol && (
        <BottomNavbar 
          items={sidebarItems} 
          module={getModuleByRole(user.rol)}
        />
      )}

      {/* Main content */}
      <div className={`p-4 ${!isMobile ? 'md:ml-72' : 'pb-20'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {!isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
          {isMobile && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;