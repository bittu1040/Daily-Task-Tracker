import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseService = inject(SupabaseService);
  const toastr = inject(ToastrService);
  const commonService = inject(CommonService);
  const accessToken = supabaseService.getAccessToken();

  const authReq = accessToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      // Handle 401 errors with token refresh (existing logic)
      if (error.status === 401 && accessToken) {
        return supabaseService.refreshToken().pipe(
          switchMap((newTokens:any) => {
            supabaseService.saveTokens(newTokens.access_token, newTokens.refresh_token);
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newTokens.access_token}`
              }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            supabaseService.logout();
            showErrorMessage(refreshError, toastr);
            return throwError(() => refreshError);
          })
        );
      }
      
      // Handle all other errors globally
      showErrorMessage(error, toastr);
      return throwError(() => error);
    })
  );
};

// Global error message handler
function showErrorMessage(error: any, toastr: ToastrService) {
  let errorMessage = 'Something went wrong. Please try again.';
  
  if (error.status === 0) {
    errorMessage = 'Network error. Please check your connection.';
  } else if (error.status >= 500) {
    errorMessage = 'Server error. Please try again later.';
  } else if (error.status === 401) {
    errorMessage = 'Session expired. Please log in again.';
  }
  
  toastr.error(errorMessage);
}
