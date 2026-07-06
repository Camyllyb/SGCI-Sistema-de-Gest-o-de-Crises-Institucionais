import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { TipoCrise, TipoCriseRequest } from '../models/tipo-crise.model';

@Injectable({ providedIn: 'root' })
export class TipoCriseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/tipos-crise`;

  listAll(): Observable<TipoCrise[]> {
    return this.http.get<TipoCrise[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<TipoCrise> {
    return this.http.get<TipoCrise>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: TipoCriseRequest): Observable<TipoCrise> {
    return this.http.post<TipoCrise>(this.baseUrl, request, { withCredentials: true });
  }

  update(id: number, request: TipoCriseRequest): Observable<TipoCrise> {
    return this.http.put<TipoCrise>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
