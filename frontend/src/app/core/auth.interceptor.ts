import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Attaches Authorization: Bearer <access token> to every /v1/* request.
 * On a 401 from a request that had a token attached, attempts exactly one
 * silent refresh via /v1/auth/refresh before giving up and propagating the
 * error (Section 05).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (!req.url.includes('/v1/')) {
    return next(req);
  }

  const token = auth.getAccessToken();
  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const isAuthRoute = req.url.includes('/v1/auth/');
      if (err.status !== 401 || isAuthRoute) {
        return throwError(() => err);
      }
      return auth.refresh().pipe(
        switchMap((tokens) => {
          const retried = req.clone({ setHeaders: { Authorization: `Bearer ${tokens.access_token}` } });
          return next(retried);
        }),
        catchError((refreshErr) => throwError(() => refreshErr))
      );
    })
  );
};
