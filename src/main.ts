import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { app_routes } from './app/app.routes';

bootstrapApplication(AppComponent, { providers: [provideRouter(app_routes)] });
