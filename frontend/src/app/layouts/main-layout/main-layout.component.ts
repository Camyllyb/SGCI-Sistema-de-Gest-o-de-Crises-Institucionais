import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { RoleDirective } from '../../core/directives/role.directive';
import { AuthService } from '../../core/services/auth.service';

const CRUMB_LABELS: Record<string, string> = {
  dashboard: 'Painel',
  crises: 'Crises',
  nova: 'Nova Crise',
  relatorios: 'Relatórios',
  novo: 'Novo Relatório',
  departamentos: 'Departamentos',
  'tipos-crise': 'Tipos de Crise',
  cenarios: 'Cenários de Crise',
  campi: 'Campi',
  instituicoes: 'Instituições',
  usuarios: 'Usuários',
  auditoria: 'Auditoria',
  editar: 'Editar',
};

const SIDEBAR_COLLAPSED_KEY = 'sgci.sidebar.collapsed';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RoleDirective],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;
  readonly crumbs = signal<string[]>([]);
  readonly collapsed = signal<boolean>(this.readCollapsed());
  readonly mobileOpen = signal(false);

  constructor() {
    this.updateCrumbs(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.updateCrumbs(event.urlAfterRedirects);
        this.mobileOpen.set(false);
      });
  }

  toggleSidebar(): void {
    const isMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      this.mobileOpen.update((open) => !open);
      return;
    }
    this.collapsed.update((collapsed) => {
      const next = !collapsed;
      this.persistCollapsed(next);
      return next;
    });
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  private readCollapsed(): boolean {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  private persistCollapsed(value: boolean): void {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value));
    } catch {
      /* localStorage indisponível — ignora persistência */
    }
  }

  private updateCrumbs(url: string): void {
    const segments = url.split('?')[0].split('/').filter(Boolean);
    this.crumbs.set(segments.map((segment) => this.labelFor(segment)));
  }

  private labelFor(segment: string): string {
    if (/^\d+$/.test(segment)) {
      return 'Detalhe';
    }
    return CRUMB_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
