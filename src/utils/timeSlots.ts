// Define la estructura de un bloque de tiempo
export interface TimeSlot {
  horaInicio: string;    // Hora de inicio del bloque (ej: "16:00:00")
  horaFin: string;       // Hora de fin del bloque (ej: "17:00:00")
  disponible: boolean;   // Indica si el bloque está disponible para reservar
}

// Función que genera un array de bloques de tiempo desde las 16:00 hasta las 23:00
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  // Itera desde la hora 16 hasta la 23
  for (let hora = 16; hora < 24; hora++) {
      slots.push({
          // padStart(2, '0') asegura que la hora tenga 2 dígitos (ej: "06" en vez de "6")
          horaInicio: `${hora.toString().padStart(2, '0')}:00:00`,
          horaFin: `${(hora + 1).toString().padStart(2, '0')}:00:00`,
          disponible: true
      });
  }
  return slots;
}

// Función que verifica si un bloque de tiempo ya pasó
export function isTimeSlotPast(date: Date, timeStr: string): boolean {
  const now = new Date();  // Obtiene la fecha y hora actual
  // Extrae la hora del string de tiempo (ej: "16:00:00" -> 16)
  const [hours] = timeStr.split(':').map(Number);
  
  // Crea una nueva fecha con la fecha proporcionada
  const slotDate = new Date(date);
  // Establece la hora del bloque manteniendo la fecha
  slotDate.setHours(hours, 0, 0, 0);
  
  // Retorna true si el bloque ya pasó
  return slotDate <= now;
}

// Función que formatea la hora para mostrar solo HH:mm
export function formatTimeSlot(time: string): string {
  // Toma los primeros 5 caracteres del string de tiempo
  return time.substring(0, 5); // "16:00:00" -> "16:00"
}