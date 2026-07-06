import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Instituicao, InstituicaoRequest } from '../models/instituicao.model';

@Injectable({ providedIn: 'root' })
export class InstituicaoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/instituicoes`;

  listAll(): Observable<Instituicao[]> {
    return this.http.get<Instituicao[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Instituicao> {
    return this.http.get<Instituicao>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: InstituicaoRequest): Observable<Instituicao> {
    return this.http.post<Instituicao>(this.baseUrl, request, { withCredentials: true });
  }

  update(id: number, request: InstituicaoRequest): Observable<Instituicao> {
    return this.http.put<Instituicao>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
