import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly _http = inject(HttpClient);
    constructor() { }

    getUsers(): Observable<any> {
        return this._http.get('https://jsonplaceholder.typicode.com/users');
    }
}