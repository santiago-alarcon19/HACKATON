import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../decide-root.component').then((m) => m.DecideRootComponent),
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('../pages/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
      },
    ],
  },
];
