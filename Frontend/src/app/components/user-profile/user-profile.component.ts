import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

}