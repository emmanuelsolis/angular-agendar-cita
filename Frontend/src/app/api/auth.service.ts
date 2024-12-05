import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.isAuthenticated$.next(!!this.currentUserValue);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUserValue;
  }

  login(email: string, password: string): Observable<User> {
    // Mock login for now
    return new Observable<User>(observer => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: email,
        role: 'user'
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      this.currentUserSubject.next(mockUser);
      this.isAuthenticated$.next(true);
      observer.next(mockUser);
      observer.complete();
    });
  }

  register(userData: { name: string; email: string; password: string }): Observable<User> {
    // Mock register for now
    return new Observable<User>(observer => {
      const mockUser: User = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'user'
      };
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      this.currentUserSubject.next(mockUser);
      this.isAuthenticated$.next(true);
      observer.next(mockUser);
      observer.complete();
    });
  }

  logout(): Observable<void> {
    return new Observable<void>(observer => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.isAuthenticated$.next(false);
      observer.next();
      observer.complete();
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  checkAuthStatus(): void {
    const user = this.getUserFromStorage();
    this.currentUserSubject.next(user);
    this.isAuthenticated$.next(!!user);
  }
}