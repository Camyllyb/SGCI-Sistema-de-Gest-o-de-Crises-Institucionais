import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Departamento, DepartamentoRequest } from '../models/departamento.model';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/departamentos`;

  listAll(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: DepartamentoRequest): Observable<Departamento> {
    return this.http.post<Departamento>(this.baseUrl, request, { withCredentials: true });
  }

  update(id: number, request: DepartamentoRequest): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
