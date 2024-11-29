import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfessionalService } from '../../api/professional.service';
import { AuthService } from '../../api/auth.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FullCalendarModule,
    AppointmentFormComponent,
    LoginFormComponent,
    RegisterFormComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  professionals: any[] = [];
  specialities: Set<string> = new Set();
  selectedSpeciality: string | null = null;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this)
  };

  // Modal control
  showAppointmentModal = false;
  showLoginModal = false;
  showRegisterModal = false;
  selectedProfessional: any = null;
  selectedDate: Date | null = null;

  // Auth state
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private professionalService: ProfessionalService,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  async ngOnInit() {
    this.professionals = await this.professionalService.getProfessionals();
    this.extractSpecialities();
    this.checkAuthStatus();
    this.loadAppointments();
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUser();
      this.loadAppointments();
    }
  }

  extractSpecialities() {
    this.professionals.forEach(professional => {
      if (professional.especialidad) {
        this.specialities.add(professional.especialidad);
      }
    });
  }

  selectSpeciality(speciality: string) {
    this.selectedSpeciality = speciality === this.selectedSpeciality ? null : speciality;
  }

  get filteredProfessionals() {
    if (!this.selectedSpeciality) {
      return this.professionals;
    }
    return this.professionals.filter(p => p.especialidad === this.selectedSpeciality);
  }

  // Calendar event handlers
  handleEventClick(clickInfo: EventClickArg) {
    const appointment = clickInfo.event.extendedProps;
    // You can show appointment details in a modal here
    console.log('Appointment clicked:', appointment);
  }

  handleDateClick(arg: any) {
    if (!this.isLoggedIn) {
      this.openLoginModal();
      return;
    }
    this.selectedDate = arg.date;
    if (this.selectedProfessional) {
      this.showAppointmentModal = true;
    }
  }

  // Modal methods
  openAppointmentModal(professional: any) {
    if (!this.isLoggedIn) {
      this.openLoginModal();
      return;
    }
    this.selectedProfessional = professional;
    this.showAppointmentModal = true;
  }

  closeAppointmentModal() {
    this.showAppointmentModal = false;
    this.selectedProfessional = null;
    this.selectedDate = null;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  // Event handlers
  onAppointmentCreated(appointment: Appointment) {
    this.closeAppointmentModal();
    this.loadAppointments();
  }

  onLoginSuccess(userData: any) {
    this.closeLoginModal();
    this.checkAuthStatus();
  }

  onRegisterSuccess(userData: any) {
    this.closeRegisterModal();
    this.checkAuthStatus();
  }

  logout() {
    this.authService.logout();
    this.checkAuthStatus();
  }

  private loadAppointments() {
    if (!this.isLoggedIn || !this.currentUser) return;

    this.appointmentService.getUserAppointments(this.currentUser.id).subscribe(
      appointments => {
        this.calendarOptions.events = this.appointmentService.getCalendarEvents(appointments);
      },
      error => {
        console.error('Error loading appointments:', error);
      }
    );
  }
}
