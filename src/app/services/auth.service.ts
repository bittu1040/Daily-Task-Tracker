import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginPayload, LoginResponse, refreshTokenResponse, RegisterPayload, RegisterResponse } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://backend-node-kappa.vercel.app/api/auth';

  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  http= inject(HttpClient);
  constructor() { }

  register(user: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, user);
  }

  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  refreshToken(): Observable<refreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<refreshTokenResponse>(`${this.baseUrl}/refresh-token`, { refreshToken })
      .pipe(tap((response: refreshTokenResponse) => {
          this.saveTokens(response.accessToken, response.refreshToken);
        })
      );
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }
}
