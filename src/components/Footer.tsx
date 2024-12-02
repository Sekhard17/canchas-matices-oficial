import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFutbol,
  faEnvelope,
  faPhone,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFutbol} className="text-2xl text-emerald-500" />
              <span className="text-2xl font-bold">Matices</span>
            </div>
            <p className="text-muted-foreground">
              Las mejores canchas de fútbol en Osorno, donde la pasión por el deporte se vive al máximo.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-muted-foreground">
                <FontAwesomeIcon icon={faPhone} className="text-emerald-500" />
                <span>+56 9 54143067</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <FontAwesomeIcon icon={faEnvelope} className="text-emerald-500" />
                <span>contacto@matices.cl</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground">
                <FontAwesomeIcon icon={faLocationDot} className="text-emerald-500" />
                <span>Avenida Real 1405, Rahue Alto</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a href="#courts" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Nuestras Canchas
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                  Testimonios
                </a>
              </li>
            </ul>
          </div>

          {/* Social & App */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-emerald-500 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Matices. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;