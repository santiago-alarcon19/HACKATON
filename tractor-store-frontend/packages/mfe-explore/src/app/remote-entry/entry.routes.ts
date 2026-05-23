import { Route } from '@angular/router';
import { ExploreLayoutComponent } from '../layout/explore-layout.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: ExploreLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'categories/:filter',
        loadComponent: () =>
          import('../pages/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
        runGuardsAndResolvers: 'paramsChange',
      },
      {
        path: 'stores',
        loadComponent: () =>
          import('../pages/stores/stores.component').then(
            (m) => m.StoresComponent
          ),
      },
    ],
  },
];
