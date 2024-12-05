import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../api/appointment.service';
import { ProfessionalService } from '../../api/professional.service';
import { AuthService } from '../../api/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="appointment-form-container">
      <h2>{{ editMode ? 'Editar Cita' : 'Nueva Cita' }}</h2>
      
      <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="professional">Profesional</label>
          <select id="professional" formControlName="professionalId" 
                  (change)="onProfessionalChange()">
            <option value="">Selecciona un profesional</option>
            <option *ngFor="let prof of professionals" [value]="prof.id">
              {{ prof.nombre }} - {{ prof.especialidad }}
            </option>
          </select>
          <div class="error-message" *ngIf="appointmentForm.get('professionalId')?.errors?.['required'] && 
               appointmentForm.get('professionalId')?.touched">
            Por favor selecciona un profesional
          </div>
        </div>

        <div class="form-group">
          <label for="date">Fecha</label>
          <input type="date" id="date" formControlName="date" 
                 [min]="minDate" (change)="onDateChange()">
          <div class="error-message" *ngIf="appointmentForm.get('date')?.errors?.['required'] && 
               appointmentForm.get('date')?.touched">
            Por favor selecciona una fecha
          </div>
        </div>

        <div class="form-group">
          <label for="startTime">Hora de inicio</label>
          <select id="startTime" formControlName="startTime" 
                  (change)="updateEndTime()">
            <option value="">Selecciona hora de inicio</option>
            <option *ngFor="let time of availableStartTimes" [value]="time">
              {{ time }}
            </option>
          </select>
          <div class="error-message" *ngIf="appointmentForm.get('startTime')?.errors?.['required'] && 
               appointmentForm.get('startTime')?.touched">
            Por favor selecciona una hora de inicio
          </div>
        </div>

        <div class="form-group">
          <label for="endTime">Hora de fin</label>
          <input type="time" id="endTime" formControlName="endTime" readonly>
        </div>

        <div class="form-group">
          <label for="notes">Notas</label>
          <textarea id="notes" formControlName="notes" rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancelar</button>
          <button type="submit" class="btn-submit" [disabled]="!appointmentForm.valid || isSubmitting">
            {{ editMode ? 'Actualizar' : 'Agendar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .appointment-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    input, select, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    textarea {
      resize: vertical;
    }

    .error-message {
      color: #f44336;
      font-size: 0.8em;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-submit {
      background-color: #4CAF50;
      color: white;
    }

    .btn-submit:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  professionals: any[] = [];
  availableStartTimes: string[] = [];
  isSubmitting = false;
  editMode = false;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private professionalService: ProfessionalService,
    private authService: AuthService,
    private router: Router
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
    this.appointmentForm = this.createForm();
  }

  ngOnInit() {
    this.loadProfessionals();
    this.generateAvailableTimes();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      professionalId: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: [''],
      notes: [''],
      userId: [this.authService.getCurrentUser()?.id]
    });
  }

  private loadProfessionals() {
    this.professionalService.getProfessionals()
      .subscribe(professionals => this.professionals = professionals);
  }

  private generateAvailableTimes() {
    const times = [];
    for (let hour = 8; hour < 18; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    this.availableStartTimes = times;
  }

  onProfessionalChange() {
    this.checkAvailability();
  }

  onDateChange() {
    this.checkAvailability();
  }

  private checkAvailability() {
    const professionalId = this.appointmentForm.get('professionalId')?.value;
    const date = this.appointmentForm.get('date')?.value;
    const startTime = this.appointmentForm.get('startTime')?.value;

    if (professionalId && date && startTime) {
      this.appointmentService.checkAvailability(professionalId, new Date(date), startTime)
        .subscribe(isAvailable => {
          if (!isAvailable) {
            this.appointmentForm.get('startTime')?.setErrors({ unavailable: true });
          }
        });
    }
  }

  updateEndTime() {
    const startTime = this.appointmentForm.get('startTime')?.value;
    if (startTime) {
      const [hours, minutes] = startTime.split(':');
      const endDate = new Date();
      endDate.setHours(parseInt(hours), parseInt(minutes) + 30);
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      this.appointmentForm.patchValue({ endTime });
    }
  }

  onSubmit() {
    if (this.appointmentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const appointmentData = this.appointmentForm.value;

      const observable = this.editMode
        ? this.appointmentService.updateAppointment(appointmentData.id, appointmentData)
        : this.appointmentService.createAppointment(appointmentData);

      observable.subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/appointments']);
          }
        },
        error: () => {
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/appointments']);
  }
}
