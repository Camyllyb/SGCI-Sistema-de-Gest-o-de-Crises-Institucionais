import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { catchError, filter, of } from 'rxjs';

import { RoleDirective } from '../../core/directives/role.directive';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordModalComponent } from '../../features/auth/components/change-password-modal/change-password-modal.component';
import { DashboardResumo } from '../../features/dashboard/models/dashboard.model';
import { DashboardService } from '../../features/dashboard/services/dashboard.service';

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
  perfil: 'Meu Perfil',
  'acesso-negado': 'Acesso Negado',
  editar: 'Editar',
};

const SIDEBAR_COLLAPSED_KEY = 'sgci.sidebar.collapsed';

interface Notificacao {
  sev: 'danger' | 'warning' | 'info';
  titulo: string;
  descricao: string;
  link: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RoleDirective,
    FormsModule,
    ChangePasswordModalComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;
  readonly isAdmin = computed(() => this.user()?.perfil === 'ADMIN');
  readonly crumbs = signal<string[]>([]);
  readonly collapsed = signal<boolean>(this.readCollapsed());
  readonly mobileOpen = signal(false);

  // Ferramentas do header
  readonly searchTerm = signal('');
  readonly notifOpen = signal(false);
  readonly profileOpen = signal(false);
  private readonly resumo = signal<DashboardResumo | null>(null);

  /** Notificações do admin derivadas do resumo (uma leitura por sessão do shell). */
  readonly notificacoes = computed<Notificacao[]>(() => {
    const r = this.resumo();
    if (!r) {
      return [];
    }
    const list: Notificacao[] = [];
    if (r.crisesCriticas > 0) {
      list.push({
        sev: 'danger',
        titulo: `${r.crisesCriticas} crise(s) crítica(s)`,
        descricao: 'Requerem atenção imediata',
        link: '/crises',
      });
    }
    if (r.crisesAbertas > 0) {
      list.push({
        sev: 'info',
        titulo: `${r.crisesAbertas} crise(s) em aberto`,
        descricao: 'Aguardando tratativa',
        link: '/crises',
      });
    }
    if (r.crisesEmAndamento > 0) {
      list.push({
        sev: 'warning',
        titulo: `${r.crisesEmAndamento} em andamento`,
        descricao: 'Sob acompanhamento',
        link: '/crises',
      });
    }
    return list;
  });

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
        this.closeMenus();
      });

    if (this.isAdmin()) {
      this.dashboardService
        .resumo()
        .pipe(catchError(() => of(null)))
        .subscribe((r) => this.resumo.set(r));
    }
  }

  /** Fecha os menus flutuantes ao clicar em qualquer lugar do documento. */
  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenus();
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

  toggleNotif(event: Event): void {
    event.stopPropagation();
    this.profileOpen.set(false);
    this.notifOpen.update((v) => !v);
  }

  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.notifOpen.set(false);
    this.profileOpen.update((v) => !v);
  }

  closeMenus(): void {
    this.notifOpen.set(false);
    this.profileOpen.set(false);
  }

  onSearch(): void {
    const term = this.searchTerm().trim();
    this.closeMenus();
    this.router.navigate(['/crises'], term ? { queryParams: { q: term } } : {});
  }

  onLogout(): void {
    this.closeMenus();
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  onFirstAccessChanged(): void {
    this.router.navigate(['/dashboard']);
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
