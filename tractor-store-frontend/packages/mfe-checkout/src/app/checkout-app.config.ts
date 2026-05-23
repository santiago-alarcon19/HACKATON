import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { API_ENV } from '@tractor-store/shared-catalog';
import { remoteRoutes } from './remote-entry/entry.routes';

export const checkoutAppConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(remoteRoutes),
    provideHttpClient(),
    {
      provide: API_ENV,
      useValue: { apiBaseUrl: 'http://localhost:8080/api' },
    },
  ],
};
