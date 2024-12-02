import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarCheck,
  faMoneyBillWave,
  faFutbol,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import AreaChartComponent from '@/components/charts/AreaChartComponent';
import PieChartComponent from '@/components/charts/PieChartComponent';
import { Card } from '@/components/ui/card';
import { adminService } from '@/services/admin.service';

interface Estadisticas {
  stats: {
    usuariosActivos: number;
    reservasMes: number;
    reservasHoy: number;
    ingresosMensuales: number;
    canchaMasReservada: string;
    porcentajeReservas: string;
  };
  graficos: {
    ingresosPorMes: Array<{ name: string; value: number }>;
    distribucionReservas: Array<{ name: string; value: number }>;
  };
}

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Estadisticas>({
    stats: {
      usuariosActivos: 0,
      reservasMes: 0,
      reservasHoy: 0,
      ingresosMensuales: 0,
      canchaMasReservada: '',
      porcentajeReservas: '0% del total'
    },
    graficos: {
      ingresosPorMes: [],
      distribucionReservas: []
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const estadisticas = await adminService.obtenerEstadisticas();
        setData(estadisticas);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const stats = [
    {
      title: 'Usuarios Activos',
      value: data.stats.usuariosActivos.toLocaleString(),
      increase: 'Total usuarios',
      icon: faUsers,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      gradient: 'from-blue-500/20 to-transparent'
    },
    {
      title: 'Reservas del Mes',
      value: data.stats.reservasMes.toLocaleString(),
      increase: '+8.2%',
      icon: faCalendarCheck,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      gradient: 'from-emerald-500/20 to-transparent'
    },
    {
      title: 'Reservas de Hoy',
      value: data.stats.reservasHoy.toLocaleString(),
      increase: '+3.1%',
      icon: faCalendarCheck,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      gradient: 'from-purple-500/20 to-transparent'
    },
    {
      title: 'Ingresos Mensuales',
      value: formatCurrency(data.stats.ingresosMensuales),
      increase: '+15.3%',
      icon: faMoneyBillWave,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      gradient: 'from-indigo-500/20 to-transparent'
    },
    {
      title: 'Cancha más Reservada',
      value: data.stats.canchaMasReservada,
      increase: '32% del total',
      icon: faFutbol,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      gradient: 'from-amber-500/20 to-transparent'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r opacity-40 dark:opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b opacity-40 dark:opacity-20 pointer-events-none" />
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 dark:opacity-20`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <FontAwesomeIcon 
                      icon={stat.icon} 
                      className={`text-xl ${stat.color}`} 
                    />
                  </div>
                  <span className="text-sm text-emerald-500 font-medium">
                    {stat.increase}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-50 dark:opacity-20" />
            <div className="relative">
              <h3 className="text-lg font-semibold mb-4">Ingresos Mensuales</h3>
              <div className="h-[300px]">
                <AreaChartComponent 
                  data={data.graficos.ingresosPorMes}
                  formatter={formatCurrency}
                  gradientId="revenueGradient"
                  strokeColor="#10B981"
                  fillColor="#10B981"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-50 dark:opacity-20" />
            <div className="relative">
              <h3 className="text-lg font-semibold mb-4">Distribución de Reservas</h3>
              <div className="h-[300px]">
                <PieChartComponent 
                  data={data.graficos.distribucionReservas}
                  colors={['#10B981', '#3B82F6']}
                  formatter={(value) => `${value}%`}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-50 dark:opacity-20" />
          <div className="relative">
            <h3 className="text-lg font-semibold mb-4">Alertas del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-amber-500/10 rounded-lg">
                <div className="text-amber-500">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
                </div>
                <div>
                  <h4 className="font-medium">Mantenimiento Programado</h4>
                  <p className="text-sm text-muted-foreground">
                    Cancha 2 requiere mantenimiento el próximo fin de semana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Overview;