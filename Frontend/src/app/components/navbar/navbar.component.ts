import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { AuthService } from '../../api/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showLoginModal = false;
  showRegisterModal = false;
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Verificar el estado de autenticación inicial
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isLoggedIn = isAuthenticated;
        if (isAuthenticated) {
          this.currentUser = this.authService.getCurrentUser();
        }
      }
    );
  }

  openLoginModal() {
    this.showLoginModal = true;
    this.showRegisterModal = false;
  }

  openRegisterModal() {
    this.showRegisterModal = true;
    this.showLoginModal = false;
  }

  closeModals() {
    this.showLoginModal = false;
    this.showRegisterModal = false;
  }

  onLoginSuccess(response: any) {
    this.closeModals();
    this.currentUser = response.user;
    this.isLoggedIn = true;
  }

  onRegisterSuccess(response: any) {
    this.closeModals();
    this.currentUser = response.user;
    this.isLoggedIn = true;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.currentUser = null;
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }
}
