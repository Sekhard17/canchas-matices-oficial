import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCalendarCheck,
  faExclamationTriangle,
  faTools,
  faCheckCircle,
  faUserClock
} from '@fortawesome/free-solid-svg-icons';

const Notifications = () => {
  // Datos de ejemplo
  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'Nueva Reserva Pendiente',
      message: 'Hay una nueva reserva para Baby Fútbol 1 que requiere confirmación.',
      date: '2024-02-20 14:30',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Mantenimiento Programado',
      message: 'Recordatorio: Mantenimiento de iluminación en Futbolito 1 mañana.',
      date: '2024-02-19 10:00',
      priority: 'medium',
      read: true
    },
    {
      id: 3,
      type: 'alert',
      title: 'Problema Reportado',
      message: 'Un cliente ha reportado un problema con el sistema de riego en Baby Fútbol 2.',
      date: '2024-02-18 16:45',
      priority: 'high',
      read: false
    },
    {
      id: 4,
      type: 'staff',
      title: 'Cambio de Turno',
      message: 'Tu próximo turno comienza mañana a las 15:00.',
      date: '2024-02-18 09:30',
      priority: 'normal',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return faCalendarCheck;
      case 'maintenance':
        return faTools;
      case 'alert':
        return faExclamationTriangle;
      case 'staff':
        return faUserClock;
      default:
        return faBell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'text-red-500 bg-red-500/10';
    }
    
    switch (type) {
      case 'booking':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'maintenance':
        return 'text-blue-500 bg-blue-500/10';
      case 'alert':
        return 'text-amber-500 bg-amber-500/10';
      case 'staff':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notificaciones</h2>
        <div className="flex space-x-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm">
            <option>Todas las notificaciones</option>
            <option>Sin leer</option>
            <option>Alta prioridad</option>
          </select>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Marcar todas como leídas
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-card rounded-xl shadow-md p-6 ${
              !notification.read ? 'border-l-4 border-primary' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                <FontAwesomeIcon 
                  icon={getNotificationIcon(notification.type)} 
                  className="text-xl" 
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {notification.priority === 'high' && (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full">
                          Alta Prioridad
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {notification.date}
                  </span>
                </div>
                {!notification.read && (
                  <div className="mt-4 flex justify-end">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-primary hover:bg-accent rounded-lg transition-colors">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Marcar como leída</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;