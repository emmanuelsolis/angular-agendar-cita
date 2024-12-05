export interface Appointment {
  id?: string;
  professionalId: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  title?: string;
}

export interface AppointmentResponse {
  success: boolean;
  data?: Appointment;
  message?: string;
}
