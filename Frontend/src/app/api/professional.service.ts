import { Injectable } from "@angular/core";
import { JsonplaceholderService } from "./jsonplaceholder.service";
import axios from "axios";

@Injectable({
    providedIn: 'root',
})

export class ProfessionalService {	
    private apiUrl = 'http://localhost:3000/api/professionals'
    constructor(private jsonPlaceholderService: JsonplaceholderService) { }

    async getProfessionals() {
        const response = await axios.get(`${this.apiUrl}/`);
        return response.data;
    }

    async loadAndSaveProfessionals(){
        const specialities = [
            'Cardiología',
            'Dermatología',
            'Neurología',
            'Pediatría',
            'Psiquiatría',
            'Odontología',
            'Ginecología',
            'Traumatología',
            'Oftalmología',
            'Nutrición',
        ];
        const users = await this.jsonPlaceholderService.getAllUsers();
        const professionals = users.map((user: any) => {
            const randomSpeciality = 
            specialities[Math.floor(Math.random() * specialities.length)];
            return {
                id: user.id,
                nombre: user.name,
                email: user.email,
                telefono: user.phone,
                speciality: randomSpeciality,
            };
        });
      
        //Enviar profesionales al backend
        const response = await axios.post(`${this.apiUrl}/bulk`, professionals);
        return response.data;
    }
}
