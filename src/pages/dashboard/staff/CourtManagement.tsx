import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFutbol,
  faCircleCheck,
  faCircleXmark,
  faTools
} from '@fortawesome/free-solid-svg-icons';

const CourtManagement = () => {
  // Datos de ejemplo
  const courts = [
    {
      id: 1,
      name: 'Baby Fútbol 1',
      type: 'Baby Fútbol',
      location: 'Rahue Alto',
      status: 'active',
      bookingsToday: 5,
      totalBookings: 150,
      revenue: 3000000
    },
    {
      id: 2,
      name: 'Baby Fútbol 2',
      type: 'Baby Fútbol',
      location: 'Rahue Alto',
      status: 'maintenance',
      bookingsToday: 0,
      totalBookings: 145,
      revenue: 2900000
    },
    {
      id: 3,
      name: 'Futbolito 1',
      type: 'Futbolito',
      location: 'Pedro Montt',
      status: 'active',
      bookingsToday: 4,
      totalBookings: 120,
      revenue: 3000000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'maintenance':
        return 'text-amber-500 bg-amber-500/10';
      case 'inactive':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return faCircleCheck;
      case 'maintenance':
        return faTools;
      case 'inactive':
        return faCircleXmark;
      default:
        return faFutbol;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'maintenance':
        return 'En Mantenimiento';
      case 'inactive':
        return 'Inactiva';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estado de Canchas</h2>
        <div className="flex space-x-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm">
            <option>Todas las ubicaciones</option>
            <option>Rahue Alto</option>
            <option>Pedro Montt</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <motion.div
            key={court.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{court.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {court.type} - {court.location}
                  </p>
                </div>
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(court.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(court.status)} />
                  <span>{getStatusText(court.status)}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold">{court.bookingsToday}</p>
                  <p className="text-sm text-muted-foreground">Reservas Hoy</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold">{court.totalBookings}</p>
                  <p className="text-sm text-muted-foreground">Total Reservas</p>
                </div>
                <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold">${(court.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-muted-foreground">Ingresos</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-accent border-t border-border flex justify-end space-x-2">
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourtManagement;