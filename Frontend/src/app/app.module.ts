import { NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    provideRouter(routes)
  ]
})
export class AppModule { }
