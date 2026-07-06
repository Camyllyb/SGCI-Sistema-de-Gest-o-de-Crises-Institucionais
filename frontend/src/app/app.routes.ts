import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'departamentos',
        loadComponent: () =>
          import('./features/departamentos/pages/list/departamento-list.component').then(
            (m) => m.DepartamentoListComponent,
          ),
      },
      {
        path: 'tipos-crise',
        loadComponent: () =>
          import('./features/tipos-crise/pages/list/tipo-crise-list.component').then(
            (m) => m.TipoCriseListComponent,
          ),
      },
      {
        path: 'instituicoes',
        loadComponent: () =>
          import('./features/instituicoes/pages/list/instituicao-list.component').then(
            (m) => m.InstituicaoListComponent,
          ),
      },
      {
        path: 'campi',
        loadComponent: () =>
          import('./features/campi/pages/list/campus-list.component').then((m) => m.CampusListComponent),
      },
      {
        path: 'cenarios',
        loadComponent: () =>
          import('./features/cenarios/pages/list/cenario-list.component').then((m) => m.CenarioListComponent),
      },
      {
        path: 'crises',
        loadComponent: () =>
          import('./features/crises/pages/list/crise-list.component').then((m) => m.CriseListComponent),
      },
      {
        path: 'crises/nova',
        loadComponent: () =>
          import('./features/crises/pages/form/crise-form.component').then((m) => m.CriseFormComponent),
      },
      {
        path: 'crises/:id',
        loadComponent: () =>
          import('./features/crises/pages/detail/crise-detail.component').then((m) => m.CriseDetailComponent),
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/relatorios/pages/list/relatorio-list.component').then((m) => m.RelatorioListComponent),
      },
      {
        path: 'relatorios/novo',
        loadComponent: () =>
          import('./features/relatorios/pages/form/relatorio-form.component').then((m) => m.RelatorioFormComponent),
      },
      {
        path: 'auditoria',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/auditoria/pages/list/auditoria-list.component').then(
            (m) => m.AuditoriaListComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
