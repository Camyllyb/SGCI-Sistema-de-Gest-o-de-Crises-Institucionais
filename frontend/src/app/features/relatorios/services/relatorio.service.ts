import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Relatorio, RelatorioRequest } from '../models/relatorio.model';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/relatorios`;

  listAll(): Observable<Relatorio[]> {
    return this.http.get<Relatorio[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Relatorio> {
    return this.http.get<Relatorio>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: RelatorioRequest): Observable<Relatorio> {
    return this.http.post<Relatorio>(this.baseUrl, request, { withCredentials: true });
  }
}
