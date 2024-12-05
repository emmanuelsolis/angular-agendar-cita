import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../api/appointment.service';
import { AuthService } from '../../api/auth.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="appointments-container">
      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="applyFilters()">
          <option value="all">Todas las citas</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="cancelled">Canceladas</option>
        </select>
      </div>

      <div class="appointments-list">
        <div *ngFor="let appointment of filteredAppointments" class="appointment-card"
             [class.pending]="appointment.status === 'pending'"
             [class.confirmed]="appointment.status === 'confirmed'"
             [class.cancelled]="appointment.status === 'cancelled'">
          <div class="appointment-header">
            <h3>{{ appointment.title || 'Cita' }}</h3>
            <span class="status-badge">{{ appointment.status }}</span>
          </div>
          
          <div class="appointment-details">
            <p><strong>Fecha:</strong> {{ appointment.date | date:'shortDate' }}</p>
            <p><strong>Hora:</strong> {{ appointment.startTime }} - {{ appointment.endTime }}</p>
            <p *ngIf="appointment.notes"><strong>Notas:</strong> {{ appointment.notes }}</p>
          </div>
          
          <div class="appointment-actions">
            <button *ngIf="appointment.status === 'pending'"
                    (click)="updateStatus(appointment.id!, 'confirmed')"
                    class="btn-confirm">
              Confirmar
            </button>
            <button *ngIf="appointment.status !== 'cancelled'"
                    (click)="updateStatus(appointment.id!, 'cancelled')"
                    class="btn-cancel">
              Cancelar
            </button>
            <button (click)="deleteAppointment(appointment.id!)"
                    class="btn-delete">
              Eliminar
            </button>
            <button (click)="editAppointment(appointment)"
                    class="btn-edit">
              Editar
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="editingAppointment" class="edit-form">
        <h3>Editar Cita</h3>
        <form (ngSubmit)="saveAppointment()">
          <div class="form-group">
            <label for="editDate">Fecha:</label>
            <input type="date" id="editDate" [(ngModel)]="editingAppointment.date" name="editDate" required>
          </div>
          <div class="form-group">
            <label for="editStartTime">Hora de inicio:</label>
            <input type="time" id="editStartTime" [(ngModel)]="editingAppointment.startTime" name="editStartTime" required>
          </div>
          <div class="form-group">
            <label for="editEndTime">Hora de fin:</label>
            <input type="time" id="editEndTime" [(ngModel)]="editingAppointment.endTime" name="editEndTime" required>
          </div>
          <div class="form-group">
            <label for="editNotes">Notas:</label>
            <textarea id="editNotes" [(ngModel)]="editingAppointment.notes" name="editNotes"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-save">Guardar</button>
            <button type="button" class="btn-cancel" (click)="cancelEditing()">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 20px;
    }

    .filters {
      margin-bottom: 20px;
    }

    .filters select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .appointments-list {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .appointment-card {
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background-color: white;
    }

    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      text-transform: capitalize;
    }

    .appointment-details {
      margin: 10px 0;
    }

    .appointment-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    button {
      padding: 6px 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-confirm {
      background-color: #4CAF50;
      color: white;
    }

    .btn-cancel {
      background-color: #ff9800;
      color: white;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
    }

    .btn-edit {
      background-color: #2196F3;
      color: white;
    }

    .pending {
      border-left: 4px solid #ff9800;
    }

    .confirmed {
      border-left: 4px solid #4CAF50;
    }

    .cancelled {
      border-left: 4px solid #f44336;
      opacity: 0.7;
    }

    .edit-form {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .btn-save {
      background-color: #4CAF50;
      color: white;
    }

    .btn-cancel {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  statusFilter: string = 'all';
  currentUserId: string = '';
  editingAppointment: Appointment | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUser()?.id || '';
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getUserAppointments(this.currentUserId)
      .subscribe(appointments => {
        this.appointments = appointments;
        this.applyFilters();
      });
  }

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      if (this.statusFilter === 'all') return true;
      return appointment.status === this.statusFilter;
    });
  }

  updateStatus(appointmentId: string, newStatus: 'confirmed' | 'cancelled') {
    this.appointmentService.updateAppointment(appointmentId, { status: newStatus })
      .subscribe(response => {
        if (response.success) {
          this.loadAppointments();
        }
      });
  }

  deleteAppointment(appointmentId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      this.appointmentService.deleteAppointment(appointmentId)
        .subscribe(response => {
          if (response.success) {
            this.loadAppointments();
          }
        });
    }
  }

  editAppointment(appointment: Appointment) {
    this.editingAppointment = { ...appointment };
  }

  cancelEditing() {
    this.editingAppointment = null;
  }

  saveAppointment() {
    if (this.editingAppointment && this.editingAppointment.id) {
      this.appointmentService.updateAppointment(this.editingAppointment.id, this.editingAppointment)
        .subscribe(response => {
          if (response.success) {
            this.loadAppointments();
            this.editingAppointment = null;
          }
        });
    }
  }
}
