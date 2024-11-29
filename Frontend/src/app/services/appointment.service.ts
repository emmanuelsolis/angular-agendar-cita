import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Appointment {
  _id?: string;
  userId: string;
  professionalId: string;
  speciality: string;
  reason: string;
  date: Date;
  status: 'Pendiente' | 'Aceptada' | 'Rechazada';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient) { }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  getUserAppointments(userId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/user/${userId}`);
  }

  getProfessionalAppointments(professionalId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/professional/${professionalId}`);
  }

  updateAppointmentStatus(appointmentId: string, status: 'Pendiente' | 'Aceptada' | 'Rechazada'): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${appointmentId}`, { status });
  }

  // Helper method to convert appointments to calendar events
  getCalendarEvents(appointments: Appointment[]) {
    return appointments.map(appointment => ({
      id: appointment._id,
      title: `Cita: ${appointment.speciality}`,
      start: new Date(appointment.date),
      backgroundColor: this.getStatusColor(appointment.status),
      extendedProps: {
        reason: appointment.reason,
        status: appointment.status
      }
    }));
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'Aceptada':
        return '#28a745';  // green
      case 'Rechazada':
        return '#dc3545';  // red
      default:
        return '#ffc107';  // yellow for pending
    }
  }
}
