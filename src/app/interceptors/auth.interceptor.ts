import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401 && authService.getAccessToken()) {
        return authService.refreshToken().pipe(
          switchMap((newTokens) => {
            const retryRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newTokens.accessToken}`
              }
            });
            return next(retryRequest);
          }),
          catchError((refreshError) => {
            // If refreshing the token fails, log the user out
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};  
