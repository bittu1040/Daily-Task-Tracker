import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    // If the user is logged in and trying to access the login page, redirect to the dashboard
    if (state.url === '/login') {
      router.navigate(['/dashboard']);
      return false;
    }
    return true; // Allow access to other routes
  } else {
    // If the user is not logged in, allow access to the login page
    if (state.url === '/login') {
      return true;
    }

    // Redirect non-logged-in users to the login page for other routes
    router.navigate(['/login']);
    return false;
  }
};
