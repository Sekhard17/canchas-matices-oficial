import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCalendarPlus,
  faCircleCheck,
  faSpinner,
  faCircleXmark,
  faChevronRight,
  faEye,
  faClock,
  faMapMarkerAlt,
  faBolt,
  faCalendarDays,
  faChartLine,
  faChartPie,
  faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useBookings } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import type { Booking } from '@/types/api.types';
import LoadingScreen from '@/components/LoadingScreen';
import BookingDetailsModal from '@/components/modals/BookingDetailsModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { saldoService } from '@/services/saldo.service';

interface Stats {
  totalBookings: number;
  hoursPlayed: number;
  totalSpent: number;
}

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

const containerAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Tipos para los estados de reserva
type BookingStatus = Booking['estado'];

const getStatusInfo = (status: BookingStatus) => {
  const statusConfig = {
    'Realizada': {
      color: 'text-blue-500 bg-blue-500/10',
      icon: faCircleCheck,
      text: 'Realizada'
    },
    'Confirmada': {
      color: 'text-emerald-500 bg-emerald-500/10',
      icon: faCircleCheck,
      text: 'Confirmada'
    },
    'Pendiente': {
      color: 'text-amber-500 bg-amber-500/10',
      icon: faSpinner,
      text: 'Pendiente'
    },
    'Cancelada': {
      color: 'text-red-500 bg-red-500/10',
      icon: faCircleXmark,
      text: 'Cancelada'
    },
    'Anulada': {
      color: 'text-red-500 bg-red-500/10',
      icon: faCircleXmark,
      text: 'Anulada'
    }
  } as const;

  return statusConfig[status] || {
    color: 'text-gray-500 bg-gray-500/10',
    icon: faCircleXmark,
    text: status
  };
};

const Overview = () => {
  const { user } = useAuth();
  const { getBookings, isLoading, error } = useBookings();
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [_recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    hoursPlayed: 0,
    totalSpent: 0
  });

  // Datos para los gráficos
  const [bookingsByType, setBookingsByType] = useState<ChartData[]>([]);
  const [monthlyBookings, setMonthlyBookings] = useState<ChartData[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingData(true);

        // Cargar reservas próximas
        const upcoming = await getBookings({
          userId: user.id,
          status: 'Confirmada' as BookingStatus
        });

        if (upcoming) {
          setUpcomingBookings(upcoming.slice(0, 5));

          // Calcular horas totales
          const totalHours = upcoming.reduce((acc: number, booking: Booking) => {
            const [startHour, startMinute] = booking.hora_inicio.split(':').map(Number);
            let [endHour, endMinute] = booking.hora_fin.split(':').map(Number);
            
            // Ajustar cuando la hora final es 00:00:00 (medianoche)
            if (endHour === 0) {
              endHour = 24; // Convertir 00:00:00 a 24:00:00
            }
            
            let hours = endHour - startHour;
            let minutes = endMinute - startMinute;
            
            // Ajustar si los minutos son negativos
            if (minutes < 0) {
              hours -= 1;
              minutes += 60;
            }
            
            // Convertir a horas decimales
            return acc + hours + (minutes / 60);
          }, 0);

          // Obtener total gastado desde Supabase
          const totalSpent = await saldoService.obtenerTotalGastado(user.id);

          // Agrupar reservas por tipo de cancha con tipos específicos
          const typeGroups = upcoming.reduce((acc: Record<string, number>, booking: Booking): Record<string, number> => {
            const type = booking.cancha?.tipo || 'Otro';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {});

          // Agrupar reservas por mes con tipos específicos
          const monthGroups = upcoming.reduce((acc: Record<string, number>, booking: Booking): Record<string, number> => {
            const month = new Date(booking.fecha).toLocaleString('es-CL', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});

          // Asegurar que los datos del gráfico sean del tipo correcto
          setBookingsByType(
            Object.entries(typeGroups).map(([name, value]): ChartData => ({
              name,
              value: Number(value)
            }))
          );

          setMonthlyBookings(
            Object.entries(monthGroups).map(([name, value]): ChartData => ({
              name,
              value: Number(value)
            }))
          );

          setStats({
            totalBookings: upcoming.length,
            hoursPlayed: Math.round(totalHours),
            totalSpent: totalSpent
          });
        }

        // Cargar reservas recientes con el estado correcto
        const recent = await getBookings({
          userId: user.id,
          status: 'Realizada' as BookingStatus
        });
        
        if (recent) {
          setRecentBookings(recent.slice(0, 3));
        }

        setIsLoadingData(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setIsLoadingData(false);
      }
    };

    loadDashboardData();
  }, [user, getBookings]);

  const statsData = [
    {
      title: 'Reservas Totales',
      value: stats.totalBookings.toString(),
      icon: faCalendarCheck,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      description: 'Total de reservas activas'
    },
    {
      title: 'Horas Jugadas',
      value: `${stats.hoursPlayed}h`,
      icon: faClock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Tiempo total en cancha'
    },
    {
      title: 'Total Invertido',
      value: stats.totalSpent.toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }),
      icon: faMoneyBill,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Inversión en reservas'
    }
  ];

  if (isLoading || isLoadingData) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
        Error al cargar los datos: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background/95 dark:to-background"
    >
      <div className="container mx-auto p-4 sm:p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemAnimation}
              className="relative overflow-hidden bg-card/30 dark:bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-xl shadow-inner`}>
                    <FontAwesomeIcon icon={stat.icon} className={`text-xl ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-background/50 dark:bg-background/30 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
                    Últimos 30 días
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{stat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Charts */}
          <div className="space-y-6">
            {/* Bookings Distribution Chart */}
            <motion.div
              variants={itemAnimation}
              className="bg-card/30 dark:bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="text-primary" />
                <span>Distribución de Reservas</span>
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {bookingsByType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium">{payload[0].name}</p>
                              <p className="text-sm text-muted-foreground">
                                {payload[0].value} reservas
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Monthly Bookings Chart */}
            <motion.div
              variants={itemAnimation}
              className="bg-card/30 dark:bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                <span>Reservas Mensuales</span>
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyBookings}>
                    <defs>
                      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                    <YAxis className="text-xs text-muted-foreground" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-lg p-3">
                              <p className="text-sm font-medium">{label}</p>
                              <p className="text-sm text-muted-foreground">
                                {payload[0].value} reservas
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      fillOpacity={1}
                      fill="url(#colorBookings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Bookings and Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              variants={itemAnimation}
              className="bg-card/30 dark:bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="text-primary" />
                <span>Acciones Rápidas</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  to="/booking"
                  className="group flex items-center p-4 bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="bg-primary/10 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faCalendarPlus} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Nueva Reserva</h3>
                    <p className="text-sm text-muted-foreground">Reserva tu próximo partido</p>
                  </div>
                </Link>

                <Link
                  to="/client/history"
                  className="group flex items-center p-4 bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="bg-primary/10 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <FontAwesomeIcon icon={faCalendarCheck} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Historial</h3>
                    <p className="text-sm text-muted-foreground">Ver todas tus reservas</p>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Upcoming Bookings */}
            <motion.div
              variants={itemAnimation}
              className="bg-card/30 dark:bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-primary" />
                  <span>Próximas Reservas</span>
                </h2>
                <Link
                  to="/client/history"
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-2 hover:gap-3 transition-all duration-300"
                >
                  Ver todas <FontAwesomeIcon icon={faChevronRight} />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.estado);
                    return (
                      <motion.div
                        key={booking.id_reserva}
                        variants={itemAnimation}
                        className="group relative overflow-hidden bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border/50 rounded-xl hover:shadow-md transition-all duration-300"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${statusInfo.color}`}>
                                <FontAwesomeIcon icon={statusInfo.icon} className="text-lg" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-foreground">
                                    {booking.cancha?.nombre || 'Cancha no especificada'}
                                  </h3>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${statusInfo.color}`}>
                                    {statusInfo.text}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faCalendarCheck} className="text-xs" />
                                    <span>
                                      {new Date(booking.fecha).toLocaleDateString('es-CL', {
                                        day: 'numeric',
                                        month: 'short'
                                      })}
                                    </span>
                                  </div>
                                  <div className="h-1 w-1 rounded-full bg-border" />
                                  <div className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faClock} className="text-xs" />
                                    <span>{booking.hora_inicio} - {booking.hora_fin}</span>
                                  </div>
                                  <div className="h-1 w-1 rounded-full bg-border" />
                                  <div className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                    <span>{booking.cancha?.ubicacion || 'Ubicación no especificada'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowModal(true);
                              }}
                              className="p-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-colors duration-300"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                          </div>
                        </div>
                        <div 
                          className={`absolute left-0 top-0 w-1 h-full ${statusInfo.color.split(' ')[1]}`}
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <FontAwesomeIcon icon={faCalendarCheck} className="text-primary text-xl" />
                    </div>
                    <p className="text-muted-foreground">No tienes reservas próximas</p>
                    <Link
                      to="/booking"
                      className="text-primary hover:text-primary/80 text-sm mt-2 inline-block"
                    >
                      ¿Quieres hacer una reserva?
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          booking={selectedBooking}
        />
      )}
    </motion.div>
  );
}

export default Overview;
