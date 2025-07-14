import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class SupabaseService {

  router = inject(Router);
  http = inject(HttpClient);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  register({ email, password, name }: { email: string, password: string, name: string }) {
    return from(this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    }));

    // return this.http.post(`${environment.supabaseUrl}/auth/v1/signup`, body, {
    //   headers: {
    //     apikey: environment.supabaseAnonKey,
    //     'Content-Type': 'application/json'
    //   }
    // });
  }

  login(payload: { email: string, password: string }) {
    return this.http.post<any>(
      `${environment.supabaseUrl}/auth/v1/token?grant_type=password`,
      payload,
      { headers: { apikey: environment.supabaseAnonKey } }
    );
  }


  getUserProfile() {
    return this.http.get<{ name: string, email: string }>(`${environment.apiBaseUrl}/v1/profile`);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      currentSession: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }));
  }

  getAccessToken(): string | null {
    const raw = localStorage.getItem('supabase.auth.token');
    return raw ? JSON.parse(raw)?.currentSession?.access_token : null;
  }

  getRefreshToken(): string | null {
    const raw = localStorage.getItem('supabase.auth.token');
    return raw ? JSON.parse(raw)?.currentSession?.refresh_token : null;
  }

  refreshToken(): Observable<any> {
    const refresh_token = this.getRefreshToken();
    return this.http.post<any>(
      `${environment.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
      { refresh_token },
      { headers: { apikey: environment.supabaseAnonKey } }
    );
  }

  logout() {
    localStorage.removeItem('supabase.auth.token');
    this.router.navigate(['/login']);
  }
}
