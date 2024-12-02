import type { Court } from './court';

export interface CashBookingData {
  court: Court;
  date: Date;
  time: string;
} 