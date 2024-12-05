import { Pipe, PipeTransform } from '@angular/core';
import { Professional } from '../models/professional.model';

@Pipe({
  name: 'professionalName',
  standalone: true
})
export class ProfessionalNamePipe implements PipeTransform {
  transform(professionals: Professional[], professionalId: string): string {
    const professional = professionals.find(p => p.id === professionalId);
    return professional ? professional.nombre : 'Profesional no encontrado';
  }
}