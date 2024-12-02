export interface TimeSlot {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hora = 16; hora < 24; hora++) {
    slots.push({
      horaInicio: `${hora.toString().padStart(2, '0')}:00:00`,
      horaFin: `${(hora + 1).toString().padStart(2, '0')}:00:00`,
      disponible: true
    });
  }
  return slots;
}

export function isTimeSlotPast(date: Date, timeStr: string): boolean {
  const now = new Date();
  const [hours] = timeStr.split(':').map(Number);
  
  const slotDate = new Date(date);
  slotDate.setHours(hours, 0, 0, 0);
  
  return slotDate <= now;
}

export function formatTimeSlot(time: string): string {
  return time.substring(0, 5); // "16:00:00" -> "16:00"
}