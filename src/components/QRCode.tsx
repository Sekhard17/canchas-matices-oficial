import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeComponentProps {
  bookingId: string;
  hashCode: string;
  size?: number;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ 
  bookingId, 
  hashCode, 
  size = 256 
}) => {
  const qrValue = `${bookingId}#${hashCode}`;

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `reserva-${hashCode}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <QRCodeCanvas value={qrValue} size={size} />
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Código de Reserva
        </p>
        <p className="font-mono text-lg font-semibold">
          #{hashCode}
        </p>
      </div>

      <button
        onClick={downloadQR}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <FontAwesomeIcon icon={faDownload} />
        <span>Descargar QR</span>
      </button>
    </motion.div>
  );
};

export default QRCodeComponent;
