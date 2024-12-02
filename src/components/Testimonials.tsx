import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  const reviews = [
    {
      name: "Carlos Martínez",
      role: "Jugador Frecuente",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
      content: "Las mejores canchas de Osorno sin duda. El césped sintético es de primera calidad y la atención del personal es excelente.",
      rating: 5
    },
    {
      name: "Andrea Soto",
      role: "Liga Femenina",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      content: "Organizamos todos nuestros partidos aquí. Las instalaciones son impecables y el sistema de reservas es muy fácil de usar.",
      rating: 5
    },
    {
      name: "Roberto Vera",
      role: "Entrenador",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      content: "Excelente lugar para entrenar. La iluminación nocturna es perfecta y los vestuarios siempre están limpios.",
      rating: 4
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gray-950">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestro mejor testimonio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl"
            >
              <div className="relative">
                <span className="text-emerald-400 text-4xl absolute -top-2 -left-2">
                  "
                </span>
                
                <div className="flex flex-col items-center text-center pt-8">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <FontAwesomeIcon 
                        key={i}
                        icon={faStar}
                        className="text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">
                    {review.content}
                  </p>
                  <h4 className="font-semibold text-white">
                    {review.name}
                  </h4>
                  <span className="text-sm text-emerald-400">
                    {review.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-all">
            Ver Más Reseñas
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;