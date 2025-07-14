import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const isLoggedIn = !!supabaseService.getAccessToken(); 
  if (isLoggedIn) {
    // Prevent access to /login if already logged in
    if (state.url === '/login') {
      router.navigate(['/dashboard']);
      return false;
    }
    return true; // allow route
  } else {
    // Allow login route if not logged in
    if (state.url === '/login') return true;

    // Redirect to login if trying to access protected routes
    router.navigate(['/login']);
    return false;
  }
};
