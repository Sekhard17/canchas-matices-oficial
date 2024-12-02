import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faTools,
  faExclamationTriangle,
  faUserClock,
  faCircleCheck,
  faSpinner,
  faCircleXmark
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useBookings, useCourts } from '@/hooks/useApi';
import type { Booking, Court } from '@/types/api.types';
import LoadingScreen from '@/components/LoadingScreen';

const Overview = () => {
  const { getBookings, isLoading: bookingsLoading } = useBookings();
  const { getCourts, isLoading: courtsLoading } = useCourts();
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const [bookingsData, courtsData] = await Promise.all([
        getBookings({ date: new Date().toISOString().split('T')[0] }),
        getCourts()
      ]);

      if (bookingsData) setTodayBookings(bookingsData);
      if (courtsData) setCourts(courtsData);

      // Simular tareas pendientes por ahora
      setPendingTasks([
        {
          id: 1,
          type: 'booking',
          title: 'Confirmar Reserva',
          description: 'Baby Fútbol 1 - 15:00',
          priority: 'high'
        },
        {
          id: 2,
          type: 'maintenance',
          title: 'Revisión de Iluminación',
          description: 'Futbolito 2',
          priority: 'medium'
        }
      ]);
    };

    loadDashboardData();
  }, [getBookings, getCourts]);

  const isLoading = bookingsLoading || courtsLoading;

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Preparar datos para los gráficos
  const bookingsByHour = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 9;
    const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
    
    const courtBookings = courts.reduce((acc, court) => {
      acc[`court${court.id_cancha}`] = todayBookings.filter(
        booking => 
          booking.hora_inicio === timeSlot && 
          booking.id_cancha === court.id_cancha
      ).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      time: timeSlot,
      ...courtBookings
    };
  });

  const weeklyStats = [
    { day: 'Lun', bookings: 24, maintenance: 2 },
    { day: 'Mar', bookings: 28, maintenance: 1 },
    { day: 'Mié', bookings: 30, maintenance: 3 },
    { day: 'Jue', bookings: 26, maintenance: 2 },
    { day: 'Vie', bookings: 32, maintenance: 1 },
    { day: 'Sáb', bookings: 36, maintenance: 0 },
    { day: 'Dom', bookings: 34, maintenance: 1 }
  ];

  const stats = [
    {
      title: 'Reservas Pendientes',
      value: todayBookings.filter(b => b.estado === 'pendiente').length.toString(),
      icon: faCalendarCheck,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Tareas de Mantenimiento',
      value: pendingTasks.filter(t => t.type === 'maintenance').length.toString(),
      icon: faTools,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Problemas Reportados',
      value: '2',
      icon: faExclamationTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Horas Restantes',
      value: '4:30',
      icon: faUserClock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return faCalendarCheck;
      case 'maintenance':
        return faTools;
      case 'issue':
        return faExclamationTriangle;
      default:
        return faCircleCheck;
    }
  };

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <FontAwesomeIcon 
                  icon={stat.icon} 
                  className={`text-xl ${stat.color}`} 
                />
              </div>
              <span className={`text-sm ${stat.color} font-medium`}>
                Hoy
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold mt-1">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Reservas de Hoy</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByHour}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {courts.map((court, index) => (
                  <Bar 
                    key={court.id_cancha}
                    dataKey={`court${court.id_cancha}`}
                    name={court.nombre}
                    fill={['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][index % 4]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Estadísticas Semanales</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  name="Reservas"
                  stroke="#10B981" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="maintenance" 
                  name="Mantenimientos"
                  stroke="#F59E0B" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Pending Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Tareas Pendientes</h3>
        <div className="grid gap-4">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-accent rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${getTaskColor(task.priority)}`}>
                  <FontAwesomeIcon 
                    icon={getTaskIcon(task.type)} 
                    className="text-lg" 
                  />
                </div>
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Atender
              </button>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No hay tareas pendientes
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;