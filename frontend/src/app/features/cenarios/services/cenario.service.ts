import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Cenario, CenarioRequest } from '../models/cenario.model';

@Injectable({ providedIn: 'root' })
export class CenarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/cenarios`;

  listAll(): Observable<Cenario[]> {
    return this.http.get<Cenario[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Cenario> {
    return this.http.get<Cenario>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: CenarioRequest): Observable<Cenario> {
    return this.http.post<Cenario>(this.baseUrl, request, { withCredentials: true });
  }

  update(id: number, request: CenarioRequest): Observable<Cenario> {
    return this.http.put<Cenario>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
