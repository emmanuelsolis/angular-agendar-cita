import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfessionalService } from '../../api/professional.service';
import { AppointmentService } from '../../api/appointment.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService, User } from '../../api/auth.service';
import { firstValueFrom } from 'rxjs';

interface Professional {
  id: string;
  nombre: string;
  especialidad: string;
  email: string;
  telefono: string;
  descripcion: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FullCalendarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  professionals: Professional[] = [];
  specialities: Set<string> = new Set();
  selectedSpeciality: string | null = null;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    }
  };

  // Auth state
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private professionalService: ProfessionalService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadProfessionals();
    this.extractSpecialities();
    await this.checkAuthStatus();
  }

  private async loadProfessionals() {
    try {
      const professionals = await firstValueFrom(this.professionalService.getProfessionals());
      if (professionals) {
        this.professionals = professionals;
      }
    } catch (error) {
      console.error('Error loading professionals:', error);
    }
  }

  private extractSpecialities() {
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
    console.log('Appointment clicked:', appointment);
  }

  async checkAuthStatus() {
    this.currentUser = await this.authService.getCurrentUser();
    this.isLoggedIn = !!this.currentUser;
  }
}
