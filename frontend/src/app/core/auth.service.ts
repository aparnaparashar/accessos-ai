import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'end_user' | 'developer';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user?: AuthUser;
}

const REFRESH_TOKEN_KEY = 'accessos_refresh_token';
const USER_KEY = 'accessos_user';

/**
 * Auth flow (Section 05): signup/login/refresh/logout against the
 * Next.js backend's /v1/auth/* routes. The access token is held in memory
 * only (never persisted); the refresh token and a small non-sensitive user
 * profile are kept in localStorage so a page reload doesn't force a full
 * re-login. This is a real deployed app (not a sandboxed artifact), so
 * localStorage for the refresh token is an accepted tradeoff in the absence
 * of an httpOnly-cookie-issuing backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private readonly _user = signal<AuthUser | null>(this.readStoredUser());
  readonly user = this._user.asReadonly();

  constructor(private http: HttpClient) {}

  private readStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private persist(tokens: TokenResponse) {
    this.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
    if (tokens.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
      this._user.set(tokens.user);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken || !!localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  currentRole(): UserRole | null {
    return this._user()?.role ?? null;
  }

  signup(payload: { email: string; password: string; full_name: string; role: UserRole }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiBase}/v1/auth/signup`, payload)
      .pipe(tap((res) => this.persist(res)));
  }

  login(payload: { email: string; password: string }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiBase}/v1/auth/login`, payload)
      .pipe(tap((res) => this.persist(res)));
  }

  /** Attempts a silent refresh using the stored refresh token. */
  refresh(): Observable<TokenResponse> {
    const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh_token) {
      return throwError(() => new Error('no_refresh_token'));
    }
    return this.http
      .post<TokenResponse>(`${environment.apiBase}/v1/auth/refresh`, { refresh_token })
      .pipe(
        tap((res) => {
          this.accessToken = res.access_token;
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }
}
