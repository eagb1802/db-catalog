import { Routes } from '@angular/router';

// Rutas de la feature. En app.routes.ts se montan bajo /planetas con loadChildren.
export const PLANETAS_ROUTES: Routes = [
    {
        path: '',
        title: 'Planetas',
        loadComponent: () => import('./pages/lista-planetas/lista-planetas').then((m) => m.ListaPlanetas),
    },
    {
        path: ':id',
        title: 'Detalle',
        loadComponent: () => import('./pages/detalle-planeta/detalle-planeta').then((m) => m.DetallePlaneta),
    },
];
