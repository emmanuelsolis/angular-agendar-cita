import { Injectable } from "@angular/core";
import axios from "axios";


@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
        private apiURL = 'https://localhost:4000/api/appointments';
    constructor() { }

    async createAppointment(appointment: any): Promise<any> {
        const response = await axios.post(this.apiURL, appointment);
    }

    async getAppointmentsByUserId(userId: string): Promise<any> {
        const response = await axios.get(`${this.apiURL}/user/${userId}`);
        return response.data;
    }
    // Actualizar una cita existente
    async updateAppointment(appointmentId: string, updatedAppointment: any): Promise<any> {
        const response = await axios.put(`${this.apiURL}/${appointmentId}`, updatedAppointment);
        return response.data;
    }
    // Eliminar una cita
    async deleteAppointment(appointmentId: string): Promise<any> {
        const response = await axios.delete(`${this.apiURL}/${appointmentId}`);
        return response.data;
    }
}