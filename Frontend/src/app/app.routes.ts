import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppointmentListComponent } from './components/appointment/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment/appointment-form.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'appointments',
    component: AppointmentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'appointments/new',
    component: AppointmentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'appointments/edit/:id',
    component: AppointmentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];
