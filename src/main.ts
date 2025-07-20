import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { inject } from '@vercel/analytics';

inject(); // Initialize Vercel Analytics

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
