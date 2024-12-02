import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faChartBar,
  faChartPie,
  faDownload,  
} from '@fortawesome/free-solid-svg-icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useState, useEffect } from 'react';
import { reportsService } from '@/services/reports.service'

const Reports = () => {
  const [reportData, setReportData] = useState({
    revenueData: [],
    courtUsageData: [],
    timeDistributionData: [],
    resumen: {
      totalIngresos: 0,
      totalReservas: 0,
      tasaOcupacion: 0,
      promedioReserva: 0,
      variaciones: {
        ingresos: 0,
        reservas: 0
      }
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await reportsService.getReportData();
        setReportData(data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        // Aquí podrías mostrar un toast o notificación de error
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  if (loading) {
    return <div className="flex justify-center items-center h-96">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reportes y Estadísticas</h2>
        <div className="flex space-x-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2">
            <option>Últimos 6 meses</option>
            <option>Último mes</option>
            <option>Último año</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <FontAwesomeIcon icon={faDownload} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Ingresos y Reservas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Ingresos y Reservas</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={formatCurrency}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `${value} res.`}
                />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Ingresos"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  name="Reservas"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Uso de Canchas y Distribución Horaria */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Uso de Canchas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Uso de Canchas</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.courtUsageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip />
                  <Bar dataKey="usage" fill="#10B981">
                    {reportData.courtUsageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Distribución Horaria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Distribución Horaria</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.timeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.timeDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Tabla de Resumen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Resumen del Período</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Ingresos</span>
                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(reportData.resumen.totalIngresos)}</p>
              <p className={`text-sm ${reportData.resumen.variaciones.ingresos >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {reportData.resumen.variaciones.ingresos >= 0 ? '+' : ''}{reportData.resumen.variaciones.ingresos}% vs período anterior
              </p>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Reservas</span>
                <FontAwesomeIcon icon={faChartBar} className="text-primary" />
              </div>
              <p className="text-2xl font-bold">{reportData.resumen.totalReservas}</p>
              <p className={`text-sm ${reportData.resumen.variaciones.reservas >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {reportData.resumen.variaciones.reservas >= 0 ? '+' : ''}{reportData.resumen.variaciones.reservas}% vs período anterior
              </p>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tasa de Ocupación</span>
                <FontAwesomeIcon icon={faChartPie} className="text-primary" />
              </div>
              <p className="text-2xl font-bold">{reportData.resumen.tasaOcupacion}%</p>
              <p className="text-sm text-emerald-500">Promedio del período</p>
            </div>

            <div className="p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Promedio por Reserva</span>
                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(reportData.resumen.promedioReserva)}</p>
              <p className="text-sm text-emerald-500">Valor promedio</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;