import { bootstrapApplication } from '@angular/platform-browser';
import { DecideRootComponent } from './app/decide-root.component';
import { decideAppConfig } from './app/decide-app.config';

bootstrapApplication(DecideRootComponent, decideAppConfig).catch(console.error);
