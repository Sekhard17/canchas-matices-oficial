import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSun, faMoon, faSignOutAlt, faReceipt } from '@fortawesome/free-solid-svg-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  icon: any;
  label: string;
  path: string;
}

interface BottomNavbarProps {
  items: NavItem[];
  module: 'admin' | 'staff' | 'client';
}

const BottomNavbar = ({ items, module }: BottomNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="flex items-center justify-between px-6 py-2">
        {items
          .filter(item => !['Mi Perfil', 'Mis Recibos'].includes(item.label))
          .map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`
                flex flex-col items-center w-12
                ${location.pathname === item.path 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <FontAwesomeIcon 
                icon={item.icon} 
                className={`text-xl mb-0.5 ${location.pathname === item.path ? 'scale-110' : ''}`}
              />
              <span className="text-[9px] font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center w-12 focus:outline-none">
            <FontAwesomeIcon 
              icon={faUser} 
              className="text-xl mb-0.5 text-muted-foreground"
            />
            <span className="text-[9px] font-medium whitespace-nowrap text-muted-foreground">
              {user?.nombre?.split(' ')[0]}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 mb-2"
          >
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/${module}/profile`)}>
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/${module}/receipts`)}>
              <FontAwesomeIcon icon={faReceipt} className="mr-2" />
              Mis Recibos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              <FontAwesomeIcon 
                icon={theme === 'dark' ? faSun : faMoon} 
                className="mr-2" 
              />
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default BottomNavbar; 