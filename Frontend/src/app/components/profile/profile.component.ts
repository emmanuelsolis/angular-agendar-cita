import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../api/appointment.service';
import { AuthService } from '../../api/auth.service';
import { ProfessionalService } from '../../api/professional.service';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';
import { Professional } from '../../models/professional.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  appointments: Appointment[] = [];
  professionals: Professional[] = [];
  editingAppointment: Appointment | null = null;
  newAppointment: Appointment = {
    professionalId: '',
    userId: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    status: 'pending',
    notes: ''
  };

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private professionalService: ProfessionalService
  ) {}

  async ngOnInit() {
    await this.loadUserData();
    await this.loadAppointments();
    await this.loadProfessionals();
  }

  private async loadUserData() {
    this.currentUser = await this.authService.getCurrentUser();
    if (this.currentUser) {
      this.newAppointment.userId = this.currentUser.id;
    }
  }

  private async loadAppointments() {
    if (this.currentUser) {
      this.appointmentService.getUserAppointments(this.currentUser.id)
        .subscribe(appointments => {
          this.appointments = appointments;
        });
    }
  }

  private async loadProfessionals() {
    this.professionalService.getProfessionals()
      .subscribe(professionals => {
        this.professionals = professionals;
      });
  }

  startEditing(appointment: Appointment) {
    this.editingAppointment = { ...appointment };
  }

  cancelEditing() {
    this.editingAppointment = null;
  }

  async updateAppointment() {
    if (this.editingAppointment && this.editingAppointment.id) {
      this.appointmentService.updateAppointment(
        this.editingAppointment.id,
        this.editingAppointment
      ).subscribe(response => {
        if (response.success) {
          this.loadAppointments();
          this.editingAppointment = null;
        }
      });
    }
  }

  async deleteAppointment(appointmentId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.appointmentService.deleteAppointment(appointmentId)
        .subscribe(response => {
          if (response.success) {
            this.loadAppointments();
          }
        });
    }
  }

  async createAppointment() {
    if (this.currentUser) {
      this.appointmentService.createAppointment(this.newAppointment)
        .subscribe(response => {
          if (response.success) {
            this.loadAppointments();
            this.resetNewAppointment();
          }
        });
    }
  }

  private resetNewAppointment() {
    this.newAppointment = {
      professionalId: '',
      userId: this.currentUser?.id || '',
      date: new Date(),
      startTime: '',
      endTime: '',
      status: 'pending',
      notes: ''
    };
  }

  editProfile() {
    // Logic to enable profile editing
  }

  saveProfile() {
    // Logic to save updated profile data
  }
}
