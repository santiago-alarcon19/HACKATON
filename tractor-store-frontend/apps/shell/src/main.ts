import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

async function bootstrap(): Promise<void> {
  if (typeof window !== 'undefined') {
    window.__TRACTOR_API_BASE__ = environment.apiBaseUrl;
  }

  if (environment.useMsw && !environment.production) {
    const { startBrowserMsw } = await import('@tractor-store/msw-handlers');
    await startBrowserMsw(environment.apiBaseUrl);
  }
  await bootstrapApplication(AppComponent, appConfig);
}

bootstrap().catch(console.error);
