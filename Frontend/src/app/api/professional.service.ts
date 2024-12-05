import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = 'http://localhost:3000/professionals';

  constructor(private http: HttpClient) {}

  async getProfessionals(): Promise<Professional[]> {
    try {
      console.log('Fetching professionals from:', this.apiUrl);
      const response = await lastValueFrom(this.http.get<Professional[]>(this.apiUrl));
      console.log('Professionals received:', response);
      return response;
    } catch (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }
  }

  getProfessionalById(id: string): Observable<Professional> {
    return this.http.get<Professional>(`${this.apiUrl}/${id}`);
  }
}
