import { NgModule, PLATFORM_ID, Inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentFormComponent } from './components/appointment/appointment-form.component';
import { AppointmentListComponent } from './components/appointment/appointment-list.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppointmentFormComponent,
    AppointmentListComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    {
      provide: 'WINDOW',
      useFactory: (platformId: Object): Window | object => {
        if (isPlatformBrowser(platformId)) {
          return window;
        }
        return {
          document: {},
          location: {},
          navigator: {},
          localStorage: {
            getItem: () => null,
            setItem: () => null
          }
        };
      },
      deps: [PLATFORM_ID]
    }
  ]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      // Browser-specific initialization code here
    }
  }
}
