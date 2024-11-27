import { Injectable } from "@angular/core";



@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly _http = 'https://jsonplaceholder.typicode.com/users';
    constructor() { }

    getUsers() {
        return fetch(this._http).then(res => res.json());
    }
}