import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Professional } from '../../models/professional.interface';
import { ProfessionalService } from '../../api/professional.service';

@Component({
  selector: 'app-add-professional-form',
  templateUrl: './add-professional-form.component.html',
  styleUrls: ['./add-professional-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class AddProfessionalFormComponent {
  professionalForm: FormGroup;
  loading = false;
  @Output() professionalAdded = new EventEmitter<Professional>();

  specialties = [
    'Cardiología',
    'Dermatología',
    'Pediatría',
    'Neurología',
    'Oftalmología',
    'Ginecología',
    'Traumatología',
    'Psiquiatría'
  ];

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private dialogRef: MatDialogRef<AddProfessionalFormComponent>
  ) {
    this.professionalForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      registrationNumber: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.professionalForm.valid) {
      this.loading = true;
      const professional: Professional = this.professionalForm.value;

      this.professionalService.saveProfessional(professional).then(
        (response) => {
          this.professionalAdded.emit(response);
          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error al guardar el profesional:', error);
          this.loading = false;
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.professionalForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control.hasError('email')) {
      return 'Email inválido';
    }

    if (control.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }

    if (control.hasError('pattern')) {
      return 'Debe ingresar un número de teléfono válido (10 dígitos)';
    }

    return '';
  }
}
