import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faShower, 
  faParking,
  faWifi,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

const Fields = () => {
  const courts = [
    {
      type: 'BABY FÚTBOL',
      players: '5 VS 5',
      price: '20.000',
      location: 'RAHUE ALTO',
      image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80',
      features: ['Césped sintético profesional', 'Iluminación LED', 'Mallas protectoras']
    },
    {
      type: 'FUTBOLITO',
      players: '7 VS 7',
      price: '25.000',
      location: 'PEDRO MONTT',
      image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?auto=format&fit=crop&q=80',
      features: ['Césped sintético de alta calidad', 'Sistema de drenaje', 'Arcos reglamentarios']
    }
  ];

  const amenities = [
    { icon: faShower, label: 'VESTUARIOS' },
    { icon: faParking, label: 'ESTACIONAMIENTO' },
    { icon: faWifi, label: 'WIFI GRATIS' },
    { icon: faShieldHalved, label: 'SEGURIDAD 24/7' }
  ];

  return (
    <section id="courts" className="py-24 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            NUESTRAS CANCHAS
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            INSTALACIONES DE PRIMER NIVEL PARA TU MEJOR EXPERIENCIA
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {courts.map((court, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-900 rounded-3xl overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={court.image}
                  alt={`Cancha ${court.type}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full">
                  ${court.price}/hr
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {court.type}
                  </h3>
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <FontAwesomeIcon icon={faUsers} />
                    <span className="font-semibold">{court.players}</span>
                  </div>
                </div>

                <p className="text-gray-400 font-medium mb-6">
                  UBICACIÓN: {court.location}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {court.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-gray-300">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <FontAwesomeIcon 
                        icon={amenity.icon} 
                        className="text-2xl text-emerald-400 mb-2"
                      />
                      <span className="text-xs text-gray-400">
                        {amenity.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fields;