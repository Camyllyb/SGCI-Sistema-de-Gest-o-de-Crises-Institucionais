import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { DashboardResumo } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/dashboard`;

  resumo(): Observable<DashboardResumo> {
    return this.http.get<DashboardResumo>(`${this.baseUrl}/resumo`, { withCredentials: true });
  }
}
