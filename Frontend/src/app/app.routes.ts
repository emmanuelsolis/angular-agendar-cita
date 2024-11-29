import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'calendar',
        loadComponent: () => import('./components/calendar/calendar.component').then(m => m.CalendarComponent)
    },
    {
        path: 'user-profile',
        loadComponent: () => import('./components/user-profile/user-profile.component').then(m => m.UserProfileComponent)
    }
];
