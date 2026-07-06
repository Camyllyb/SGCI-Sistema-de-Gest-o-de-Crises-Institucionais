import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/usuarios`;

  listAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, request, { withCredentials: true });
  }

  update(id: number, request: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  resetSenha(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/reset-senha`, {}, { withCredentials: true });
  }
}
