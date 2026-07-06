import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api.config';
import { Campus, CampusRequest } from '../models/campus.model';

@Injectable({ providedIn: 'root' })
export class CampusService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/api/campi`;

  listAll(): Observable<Campus[]> {
    return this.http.get<Campus[]>(this.baseUrl, { withCredentials: true });
  }

  findById(id: number): Observable<Campus> {
    return this.http.get<Campus>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(request: CampusRequest): Observable<Campus> {
    return this.http.post<Campus>(this.baseUrl, request, { withCredentials: true });
  }

  update(id: number, request: CampusRequest): Observable<Campus> {
    return this.http.put<Campus>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
