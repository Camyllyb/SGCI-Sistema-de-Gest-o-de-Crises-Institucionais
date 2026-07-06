import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { changePasswordGuard } from './core/guards/change-password.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'trocar-senha',
    canActivate: [changePasswordGuard],
    loadComponent: () =>
      import('./features/auth/pages/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent,
      ),
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
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/departamentos/pages/list/departamento-list.component').then(
            (m) => m.DepartamentoListComponent,
          ),
      },
      {
        path: 'departamentos/novo',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/departamentos/pages/form/departamento-form.component').then(
            (m) => m.DepartamentoFormComponent,
          ),
      },
      {
        path: 'departamentos/:id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/departamentos/pages/form/departamento-form.component').then(
            (m) => m.DepartamentoFormComponent,
          ),
      },
      {
        path: 'tipos-crise',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/tipos-crise/pages/list/tipo-crise-list.component').then(
            (m) => m.TipoCriseListComponent,
          ),
      },
      {
        path: 'tipos-crise/novo',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/tipos-crise/pages/form/tipo-crise-form.component').then(
            (m) => m.TipoCriseFormComponent,
          ),
      },
      {
        path: 'tipos-crise/:id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/tipos-crise/pages/form/tipo-crise-form.component').then(
            (m) => m.TipoCriseFormComponent,
          ),
      },
      {
        path: 'instituicoes',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/instituicoes/pages/list/instituicao-list.component').then(
            (m) => m.InstituicaoListComponent,
          ),
      },
      {
        path: 'instituicoes/novo',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/instituicoes/pages/form/instituicao-form.component').then(
            (m) => m.InstituicaoFormComponent,
          ),
      },
      {
        path: 'instituicoes/:id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/instituicoes/pages/form/instituicao-form.component').then(
            (m) => m.InstituicaoFormComponent,
          ),
      },
      {
        path: 'campi',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/campi/pages/list/campus-list.component').then((m) => m.CampusListComponent),
      },
      {
        path: 'campi/novo',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/campi/pages/form/campus-form.component').then((m) => m.CampusFormComponent),
      },
      {
        path: 'campi/:id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/campi/pages/form/campus-form.component').then((m) => m.CampusFormComponent),
      },
      {
        path: 'cenarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/cenarios/pages/list/cenario-list.component').then((m) => m.CenarioListComponent),
      },
      {
        path: 'cenarios/novo',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/cenarios/pages/form/cenario-form.component').then((m) => m.CenarioFormComponent),
      },
      {
        path: 'cenarios/:id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/cenarios/pages/form/cenario-form.component').then((m) => m.CenarioFormComponent),
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
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/usuarios/pages/list/usuario-list.component').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'usuarios/novo',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/usuarios/pages/form/usuario-form.component').then((m) => m.UsuarioFormComponent),
      },
      {
        path: 'usuarios/:id/editar',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/usuarios/pages/form/usuario-form.component').then((m) => m.UsuarioFormComponent),
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
