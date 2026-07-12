import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from '../models/auth.model';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/auth`;

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => this.currentUser.set(null)),
    );
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => this.currentUser.set(user)),
    );
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/perfil`);
  }

  changePassword(request: ChangePasswordRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/change-password`, request).pipe(
      tap(() => {
        const user = this.currentUser();
        if (user) {
          this.currentUser.set({ ...user, mustChangePassword: false });
        }
      }),
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(request: ResetPasswordRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/reset-password`, request);
  }
}
