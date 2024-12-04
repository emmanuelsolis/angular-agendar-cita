import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './api/users.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './api/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, JsonPipe, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'agenda-citas-app';
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  /*users$ = this.usersService.getUsers();*/
  users$ = this.usersService.getAllUsers();

  async ngOnInit() {
    this.users$ = await this.usersService.getAllUsers();
    this.authService.checkAuthStatus();
  }
}
