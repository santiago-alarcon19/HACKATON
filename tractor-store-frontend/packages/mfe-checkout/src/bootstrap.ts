import { bootstrapApplication } from '@angular/platform-browser';
import { CheckoutRootComponent } from './app/checkout-root.component';
import { checkoutAppConfig } from './app/checkout-app.config';

bootstrapApplication(CheckoutRootComponent, checkoutAppConfig).catch(console.error);
