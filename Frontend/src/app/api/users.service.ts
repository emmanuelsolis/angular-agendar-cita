import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import axios from "axios";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly _http = inject(HttpClient);
    private apiUrl = 'https://jsonplaceholder.typicode.com';
    constructor() { }

    /*Para hacer peticiones HTTP usaremos el HttpClient de Angular.*/
    getUsers(): Observable<any> {
        return this._http.get('https://jsonplaceholder.typicode.com/users');
    }

    /* Utilizando Axios */
    async getAllUsers(): Promise<any> {
        const reponse = await axios.get(`${this.apiUrl}/users`);
        return reponse.data;
    }
    async getUser(id: number): Promise<any> {
        const reponse = await axios.get(`${this.apiUrl}/users/${id}`);
        return reponse.data;
    }
    async createUser(user: any): Promise<any> {
        const reponse = await axios.post(`${this.apiUrl}/users`, user);
        return reponse.data;
    }
    async updateUser(user: any): Promise<any> {
        const reponse = await axios.put(`${this.apiUrl}/users/${user.id}`, user);
        return reponse.data;
    }
    async deleteUser(id: number): Promise<any> {
        const reponse = await axios.delete(`${this.apiUrl}/users/${id}`);
        return reponse.data;
    }
    
   
}