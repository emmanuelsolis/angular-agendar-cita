import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Appointment, AppointmentResponse } from '../models/appointment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadAppointments();
  }

  // Cargar todas las citas
  private loadAppointments() {
    this.http.get<Appointment[]>(this.apiUrl).pipe(
      tap(appointments => this.appointmentsSubject.next(appointments))
    ).subscribe();
  }

  // Obtener todas las citas
  getAppointments(): Observable<Appointment[]> {
    return this.appointments$;
  }

  // Obtener citas por usuario
  getUserAppointments(userId: string): Observable<Appointment[]> {
    return this.appointments$.pipe(
      map(appointments => appointments.filter(app => app.userId === userId))
    );
  }

  // Obtener citas por profesional
  getProfessionalAppointments(professionalId: string): Observable<Appointment[]> {
    return this.appointments$.pipe(
      map(appointments => appointments.filter(app => app.professionalId === professionalId))
    );
  }

  // Crear nueva cita
  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(this.apiUrl, appointment).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentAppointments = this.appointmentsSubject.value;
          this.appointmentsSubject.next([...currentAppointments, response.data]);
        }
      })
    );
  }

  // Actualizar cita
  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(`${this.apiUrl}/${id}`, appointment).pipe(
      tap(response => {
        if (response.success && response.data) {
          const currentAppointments = this.appointmentsSubject.value;
          const index = currentAppointments.findIndex(app => app.id === id);
          if (index !== -1) {
            currentAppointments[index] = response.data;
            this.appointmentsSubject.next([...currentAppointments]);
          }
        }
      })
    );
  }

  // Cancelar cita
  cancelAppointment(id: string): Observable<AppointmentResponse> {
    return this.updateAppointment(id, { status: 'cancelled' });
  }

  // Eliminar cita
  deleteAppointment(id: string): Observable<AppointmentResponse> {
    return this.http.delete<AppointmentResponse>(`${this.apiUrl}/${id}`).pipe(
      tap(response => {
        if (response.success) {
          const currentAppointments = this.appointmentsSubject.value;
          this.appointmentsSubject.next(
            currentAppointments.filter(app => app.id !== id)
          );
        }
      })
    );
  }

  // Verificar disponibilidad
  checkAvailability(professionalId: string, date: Date, startTime: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, {
      params: { professionalId, date: date.toISOString(), startTime }
    });
  }
}