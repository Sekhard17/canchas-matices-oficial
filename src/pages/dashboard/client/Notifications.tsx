import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faCalendarCheck,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const Notifications = () => {
  // Datos de ejemplo
  const notifications = [
    {
      id: 1,
      type: 'booking',
      title: 'Reserva Confirmada',
      message: 'Tu reserva para Baby Fútbol 1 el día 25/02/2024 a las 18:00 ha sido confirmada.',
      date: '2024-02-20 14:30',
      read: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Recordatorio de Juego',
      message: 'Tu partido está programado para mañana a las 19:00 en Futbolito 1.',
      date: '2024-02-19 10:00',
      read: true
    },
    {
      id: 3,
      type: 'alert',
      title: 'Mantenimiento Programado',
      message: 'La cancha Baby Fútbol 2 estará en mantenimiento el próximo fin de semana.',
      date: '2024-02-18 16:45',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return faCalendarCheck;
      case 'reminder':
        return faInfoCircle;
      case 'alert':
        return faExclamationTriangle;
      default:
        return faBell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'reminder':
        return 'text-blue-500 bg-blue-500/10';
      case 'alert':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notificaciones</h2>
        <div className="flex space-x-2">
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
              <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                <FontAwesomeIcon 
                  icon={getNotificationIcon(notification.type)} 
                  className="text-xl" 
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{notification.title}</h3>
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