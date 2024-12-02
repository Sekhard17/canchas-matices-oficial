import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoice, 
  faDownload,
  faEye,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

const Receipts = () => {
  // Datos de ejemplo
  const receipts = [
    {
      id: 'REC-001',
      date: '2024-02-20',
      description: 'Reserva Baby Fútbol 1',
      amount: 20000,
      status: 'paid'
    },
    {
      id: 'REC-002',
      date: '2024-02-25',
      description: 'Reserva Futbolito 1',
      amount: 25000,
      status: 'pending'
    },
    {
      id: 'REC-003',
      date: '2024-02-15',
      description: 'Reserva Baby Fútbol 2',
      amount: 20000,
      status: 'paid'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mis Recibos</h2>
        <div className="flex space-x-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm">
            <option>Todos los estados</option>
            <option>Pagados</option>
            <option>Pendientes</option>
          </select>
          <input
            type="month"
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {receipts.map((receipt) => (
          <motion.div
            key={receipt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FontAwesomeIcon 
                    icon={faFileInvoice} 
                    className="text-xl text-primary" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{receipt.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    {receipt.id} - {receipt.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">
                  ${receipt.amount.toLocaleString('es-CL')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  receipt.status === 'paid' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {receipt.status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-end space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <FontAwesomeIcon icon={faEye} />
                <span>Ver</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                <FontAwesomeIcon icon={faDownload} />
                <span>Descargar</span>
              </button>
              {receipt.status === 'pending' && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  <span>Pagar</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Receipts;