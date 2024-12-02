import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTools,
  faCircleCheck,
  faSpinner,
  faCalendarPlus,
  faLightbulb,
  faDroplet,
  faBroom,
  faShield
} from '@fortawesome/free-solid-svg-icons';

const MaintenanceSchedule = () => {
  // Datos de ejemplo
  const maintenanceTasks = [
    {
      id: 1,
      court: 'Baby Fútbol 1',
      type: 'Iluminación',
      description: 'Revisión y ajuste de luminarias LED',
      date: '2024-02-25',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Juan Técnico',
      icon: faLightbulb
    },
    {
      id: 2,
      court: 'Futbolito 1',
      type: 'Riego',
      description: 'Mantenimiento del sistema de riego automático',
      date: '2024-02-26',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'Pedro Mantención',
      icon: faDroplet
    },
    {
      id: 3,
      court: 'Baby Fútbol 2',
      type: 'Césped',
      description: 'Limpieza profunda y cepillado del césped sintético',
      date: '2024-02-27',
      status: 'completed',
      priority: 'normal',
      assignedTo: 'Carlos Limpieza',
      icon: faBroom
    },
    {
      id: 4,
      court: 'Futbolito 2',
      type: 'Seguridad',
      description: 'Inspección de mallas y arcos',
      date: '2024-02-28',
      status: 'pending',
      priority: 'high',
      assignedTo: 'Ana Seguridad',
      icon: faShield
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'in-progress':
        return 'text-blue-500 bg-blue-500/10';
      case 'pending':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return faCircleCheck;
      case 'in-progress':
        return faSpinner;
      case 'pending':
        return faTools;
      default:
        return faTools;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'normal':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendario de Mantenimiento</h2>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <FontAwesomeIcon icon={faCalendarPlus} />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {maintenanceTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getStatusColor(task.status)}`}>
                    <FontAwesomeIcon icon={task.icon} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{task.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {task.court} - {task.date}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(task.status)} />
                  <span>{getStatusText(task.status)}</span>
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">Descripción</p>
                  <p className="text-muted-foreground">{task.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Asignado a</p>
                    <p>{task.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Prioridad</p>
                    <p className={`font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-accent border-t border-border flex justify-end space-x-2">
              {task.status === 'pending' && (
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Iniciar Tarea
                </button>
              )}
              {task.status === 'in-progress' && (
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Marcar como Completada
                </button>
              )}
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

export default MaintenanceSchedule;