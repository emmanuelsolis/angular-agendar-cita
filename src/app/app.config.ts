import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ErrorResponseInterceptor } from './shared/error.reponse.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch(), withInterceptors([ErrorResponseInterceptor])), provideRouter(routes), provideClientHydration()]
};
