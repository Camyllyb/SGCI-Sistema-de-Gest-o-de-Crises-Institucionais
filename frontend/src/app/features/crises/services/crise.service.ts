import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Acao, AcaoRequest } from '../models/acao.model';
import { Crise, CriseRequest, StatusCrise } from '../models/crise.model';

@Injectable({ providedIn: 'root' })
export class CriseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/crises`;

  listAll(): Observable<Crise[]> {
    return this.http.get<Crise[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Crise> {
    return this.http.get<Crise>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: CriseRequest): Observable<Crise> {
    return this.http.post<Crise>(this.baseUrl, request, { withCredentials: true });
  }

  changeStatus(id: number, status: StatusCrise): Observable<Crise> {
    return this.http.patch<Crise>(`${this.baseUrl}/${id}/status`, { status }, { withCredentials: true });
  }

  listAcoes(id: number): Observable<Acao[]> {
    return this.http.get<Acao[]>(`${this.baseUrl}/${id}/acoes`, { withCredentials: true });
  }

  createAcao(id: number, request: AcaoRequest): Observable<Acao> {
    return this.http.post<Acao>(`${this.baseUrl}/${id}/acoes`, request, { withCredentials: true });
  }
}
