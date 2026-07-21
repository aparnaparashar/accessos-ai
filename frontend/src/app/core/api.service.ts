import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/**
 * Central HTTP service. All API calls go through here.
 * - Auth token is attached by the global authInterceptor (app.config.ts)
 * - Retries transient 5xx / network errors up to 2 times with backoff
 * - Normalises all errors into a consistent ApiError shape
 */
export interface ApiError {
  code: string;
  detail: string;
  status: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(path, body).pipe(
      retry({
        count: 2,
        delay: (err, attempt) => {
          if (err instanceof HttpErrorResponse && err.status >= 400 && err.status < 500) {
            return throwError(() => this.toApiError(err));
          }
          return timer(attempt * 600);
        },
      }),
      catchError((err) => throwError(() => this.toApiError(err)))
    );
  }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(path).pipe(
      catchError((err) => throwError(() => this.toApiError(err)))
    );
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(path, body).pipe(
      catchError((err) => throwError(() => this.toApiError(err)))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(path).pipe(
      catchError((err) => throwError(() => this.toApiError(err)))
    );
  }

  private toApiError(err: unknown): ApiError {
    if (err instanceof HttpErrorResponse) {
      return {
        code: err.error?.error ?? 'request_failed',
        detail: err.error?.detail ?? err.message ?? 'An unexpected error occurred.',
        status: err.status,
      };
    }
    const e = err as Error;
    return { code: 'network_error', detail: e.message, status: 0 };
  }
}
