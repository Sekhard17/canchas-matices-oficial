import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBars,
  faTimes,
  faCalendarCheck,
  faHistory,
  faSignOutAlt,
  faFutbol
} from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from '@/components/ThemeToggle';

const ClientNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { name: 'Nueva Reserva', href: '/booking', icon: faCalendarCheck },
    { name: 'Mis Reservas', href: '/bookings', icon: faHistory },
  ];

  return (
    <nav className="bg-card text-card-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faFutbol} className="text-2xl text-primary" />
            <span className="text-xl font-bold">Matices</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={item.icon} className="text-lg" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                <span>Mi Perfil</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-muted-foreground hover:bg-accent"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Editar Perfil
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-destructive hover:bg-accent"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-muted-foreground hover:text-primary"
          >
            <FontAwesomeIcon 
              icon={isOpen ? faTimes : faBars} 
              className="text-2xl"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-border">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} className="text-lg" />
                  <span>Mi Perfil</span>
                </Link>
                <button
                  className="w-full flex items-center space-x-2 text-destructive hover:text-destructive/90 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ClientNavbar;