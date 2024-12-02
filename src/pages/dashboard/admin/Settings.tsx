import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faDollarSign,
  faClock,
  faGlobe,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faSave
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: 'Matices',
    email: 'contacto@matices.cl',
    phone: '+56 9 54143067',
    locations: [
      'Av. Real 1405, Rahue Alto',
      'Pedro Montt 601, Rahue Bajo'
    ],
    prices: {
      babyFutbol: 20000,
      futbolito: 25000
    },
    operatingHours: {
      weekdays: {
        open: '16:00',
        close: '00:00'
      },
      saturday: {
        open: '15:00',
        close: '00:00'
      },
      sunday: {
        open: '15:00',
        close: '23:00'
      }
    },
    bookingSettings: {
      maxDaysInAdvance: 14,
      minHoursBeforeCancel: 24,
      maxBookingsPerUser: 3
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la configuración
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de Contacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del Negocio
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faGlobe} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faPhone} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ubicaciones
              </label>
              <div className="relative">
                <textarea
                  value={settings.locations.join('\n')}
                  onChange={(e) => setSettings({ ...settings, locations: e.target.value.split('\n') })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                />
                <FontAwesomeIcon 
                  icon={faMapMarkerAlt} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Precios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Configuración de Precios</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Precio Baby Fútbol (por hora)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.prices.babyFutbol}
                  onChange={(e) => setSettings({
                    ...settings,
                    prices: { ...settings.prices, babyFutbol: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faDollarSign} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Precio Futbolito (por hora)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.prices.futbolito}
                  onChange={(e) => setSettings({
                    ...settings,
                    prices: { ...settings.prices, futbolito: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faDollarSign} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Horarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Horarios de Atención</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-4">Lunes a Viernes</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Apertura</label>
                  <input
                    type="time"
                    value={settings.operatingHours.weekdays.open}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        weekdays: { ...settings.operatingHours.weekdays, open: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Cierre</label>
                  <input
                    type="time"
                    value={settings.operatingHours.weekdays.close}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        weekdays: { ...settings.operatingHours.weekdays, close: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">Sábado</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Apertura</label>
                  <input
                    type="time"
                    value={settings.operatingHours.saturday.open}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        saturday: { ...settings.operatingHours.saturday, open: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Cierre</label>
                  <input
                    type="time"
                    value={settings.operatingHours.saturday.close}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        saturday: { ...settings.operatingHours.saturday, close: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">Domingo</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Apertura</label>
                  <input
                    type="time"
                    value={settings.operatingHours.sunday.open}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        sunday: { ...settings.operatingHours.sunday, open: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Cierre</label>
                  <input
                    type="time"
                    value={settings.operatingHours.sunday.close}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: {
                        ...settings.operatingHours,
                        sunday: { ...settings.operatingHours.sunday, close: e.target.value }
                      }
                    })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Configuración de Reservas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Configuración de Reservas</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Días máximos de anticipación
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.bookingSettings.maxDaysInAdvance}
                  onChange={(e) => setSettings({
                    ...settings,
                    bookingSettings: {
                      ...settings.bookingSettings,
                      maxDaysInAdvance: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faClock} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Horas mínimas para cancelar
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.bookingSettings.minHoursBeforeCancel}
                  onChange={(e) => setSettings({
                    ...settings,
                    bookingSettings: {
                      ...settings.bookingSettings,
                      minHoursBeforeCancel: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faClock} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Máximo de reservas por usuario
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.bookingSettings.maxBookingsPerUser}
                  onChange={(e) => setSettings({
                    ...settings,
                    bookingSettings: {
                      ...settings.bookingSettings,
                      maxBookingsPerUser: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faCog} 
                  className="absolute right-3 top-2.5 text-muted-foreground" 
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faSave} />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;