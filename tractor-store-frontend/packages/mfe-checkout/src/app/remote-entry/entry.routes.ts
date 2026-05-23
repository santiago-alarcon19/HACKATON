import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../checkout-root.component').then((m) => m.CheckoutRootComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/cart-page/cart-page.component').then(
            (m) => m.CartPageComponent
          ),
      },
      {
        path: 'thanks/:orderId',
        loadComponent: () =>
          import('../pages/thanks-page/thanks-page.component').then(
            (m) => m.ThanksPageComponent
          ),
      },
    ],
  },
];
