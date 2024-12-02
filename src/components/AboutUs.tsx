import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faHandshake, faHeart } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const features = [
    {
      icon: faTrophy,
      title: "Excelencia",
      description: "Nos esforzamos por brindar la mejor experiencia deportiva en Osorno"
    },
    {
      icon: faHandshake,
      title: "Compromiso",
      description: "Dedicados a mantener instalaciones de primer nivel para nuestros clientes"
    },
    {
      icon: faHeart,
      title: "Pasión",
      description: "Compartimos tu amor por el fútbol y lo transmitimos en cada detalle"
    }
  ];

  return (
    <section id="about" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Quiénes Somos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Más que canchas de fútbol, somos un espacio donde nacen historias y se crean momentos inolvidables
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80"
              alt="Equipo Matices"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>

          <div className="space-y-8">
            {features.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-emerald-500 p-3 rounded-xl">
                  <FontAwesomeIcon icon={value.icon} className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;