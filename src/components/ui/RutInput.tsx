import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface RutInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidRut: (rut: string) => void;
  isValid?: boolean;
  isSearching?: boolean;
  className?: string;
  disabled?: boolean;
}

export const RutInput = ({ 
  value, 
  onChange, 
  onValidRut,
  isValid,
  isSearching,
  className,
  disabled 
}: RutInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const formatRut = (value: string): string => {
    // Permitir solo números y 'K'/'k' al final
    let cleaned = value.replace(/[^0-9kK]/g, '');
    
    // Convertir 'k' minúscula a mayúscula
    cleaned = cleaned.toUpperCase();
    
    // Limitar a 9 caracteres (8 números + DV)
    if (cleaned.length > 9) {
      cleaned = cleaned.slice(0, 9);
    }

    // Si no hay caracteres, retornar vacío
    if (cleaned.length === 0) return '';

    // Separar cuerpo y dígito verificador
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    // Formatear el cuerpo con puntos
    let formatted = '';
    for (let i = 0; i < body.length; i++) {
      if (i > 0 && i % 3 === 0) {
        formatted = '.' + formatted;
      }
      formatted = body[body.length - 1 - i] + formatted;
    }

    // Agregar guion y DV
    return cleaned.length > 1 ? `${formatted}-${dv}` : cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    let cleaned = newValue.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Separar el cuerpo del RUT del DV
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    // El cuerpo siempre debe ser solo números
    const cleanedBody = body.replace(/[^0-9]/g, '');
    
    // Solo permitir K como DV si el cuerpo tiene 7 u 8 dígitos
    let cleanedDv = '';
    if (cleanedBody.length >= 7 && cleanedBody.length <= 8) {
      cleanedDv = dv.match(/[0-9K]/i) ? dv.toUpperCase() : '';
    } else {
      // Si no hay suficientes números, solo permitir números como DV
      cleanedDv = dv.match(/[0-9]/) ? dv : '';
    }
    
    // Combinar cuerpo y DV
    cleaned = cleanedBody + cleanedDv;
    
    // Limitar a 9 caracteres en total
    if (cleaned.length <= 9) {
      const formattedValue = formatRut(cleaned);
      onChange(formattedValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value.length >= 8) {
      onValidRut(value);
    }
  };

  return (
    <div className="relative">
      <Input
        value={formatRut(value)}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`pr-10 ${className}`}
        placeholder="12.345.678-9"
        disabled={disabled}
      />
      {value.length >= 8 && !isFocused && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isSearching ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-muted-foreground" />
          ) : isValid ? (
            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
          ) : (
            <FontAwesomeIcon icon={faXmark} className="text-red-500" />
          )}
        </div>
      )}
    </div>
  );
}; 