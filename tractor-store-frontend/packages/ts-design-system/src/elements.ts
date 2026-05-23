import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  API_ENV,
  defaultApiEnvironment,
} from '@tractor-store/shared-catalog';
import { TsButtonComponent } from './lib/ts-button/ts-button.component';
import { TsCartCounterComponent } from './lib/ts-cart-counter/ts-cart-counter.component';
import { TsMiniCartComponent } from './lib/ts-mini-cart/ts-mini-cart.component';
import { TsProductCardComponent } from './lib/ts-product-card/ts-product-card.component';

(async () => {
  const app = await createApplication({
    providers: [
      provideHttpClient(),
      { provide: API_ENV, useValue: defaultApiEnvironment },
    ],
  });

  const injector = app.injector;

  const register = (tag: string, component: unknown) => {
    if (!customElements.get(tag)) {
      const el = createCustomElement(component as never, { injector });
      customElements.define(tag, el);
    }
  };

  register('ts-button', TsButtonComponent);
  register('ts-product-card', TsProductCardComponent);
  register('ts-cart-counter', TsCartCounterComponent);
  register('ts-mini-cart', TsMiniCartComponent);
})();
