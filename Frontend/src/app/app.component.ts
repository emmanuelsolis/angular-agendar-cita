import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './api/users.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, JsonPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'agenda-citas-app';
  private  readonly usersService = inject(UsersService);
  /*users$ = this.usersService.getUsers();*/
  users$ = this.usersService.getAllUsers();

  async ngOnInit() {
    
    this.users$ = await this.usersService.getAllUsers();
  }
}
