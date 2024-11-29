import { Injectable } from "@angular/core";
import axios from "axios";


@Injectable({
    providedIn: 'root'
})
export class JsonplaceholderService {
    private apiUrl = 'https://jsonplaceholder.typicode.com';
   
    async getAllUsers(): Promise<any> {
        const response = await axios.get(`${this.apiUrl}/users`);
        return response.data;
    }
}