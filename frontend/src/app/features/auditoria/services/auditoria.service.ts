import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { AuditoriaFacets, AuditoriaFiltro, AuditoriaLog } from '../models/auditoria.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/auditoria`;

  listAll(filtro: AuditoriaFiltro = {}): Observable<AuditoriaLog[]> {
    let params = new HttpParams();
    if (filtro.entidade) {
      params = params.set('entidade', filtro.entidade);
    }
    if (filtro.acao) {
      params = params.set('acao', filtro.acao);
    }
    if (filtro.usuario) {
      params = params.set('usuario', filtro.usuario);
    }
    return this.http.get<AuditoriaLog[]>(this.baseUrl, { params, withCredentials: true });
  }

  facets(): Observable<AuditoriaFacets> {
    return this.http.get<AuditoriaFacets>(`${this.baseUrl}/facets`, { withCredentials: true });
  }
}
