import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('mfe-explore/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('mfe-decide/Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('mfe-checkout/Routes').then((m) => m.remoteRoutes),
  },
  { path: '**', redirectTo: '' },
];
