import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  @Input() professional: any;
  @Input() selectedDate: Date | null = null;
  @Output() appointmentCreated = new EventEmitter<Appointment>();

  appointment: Partial<Appointment> = {
    reason: '',
    date: new Date(),
    status: 'Pendiente'
  };

  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.selectedDate) {
      this.appointment.date = this.selectedDate;
    }
    
    if (this.professional) {
      this.appointment.professionalId = this.professional._id;
      this.appointment.speciality = this.professional.especialidad;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.appointment.userId = currentUser.id;
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      this.isSubmitting = false;
      return;
    }

    this.appointmentService.createAppointment(this.appointment as Appointment).subscribe(
      (createdAppointment) => {
        this.successMessage = 'Cita agendada exitosamente';
        this.isSubmitting = false;
        this.appointmentCreated.emit(createdAppointment);
      },
      (error) => {
        this.errorMessage = 'Error al agendar la cita. Por favor intente nuevamente.';
        this.isSubmitting = false;
        console.error('Error creating appointment:', error);
      }
    );
  }

  private isFormValid(): boolean {
    return !!(
      this.appointment.userId &&
      this.appointment.professionalId &&
      this.appointment.speciality &&
      this.appointment.reason &&
      this.appointment.date
    );
  }
}
