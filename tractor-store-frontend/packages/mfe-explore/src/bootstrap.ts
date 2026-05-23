import { bootstrapApplication } from '@angular/platform-browser';
import { ExploreRootComponent } from './app/explore-root.component';
import { exploreAppConfig } from './app/explore-app.config';

bootstrapApplication(ExploreRootComponent, exploreAppConfig).catch(
  console.error
);
