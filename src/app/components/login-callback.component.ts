import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupabaseService } from '../services/supabase.service';
import { CommonService } from '../services/common.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-login-callback',
  template: `<p>Logging in... Please wait.</p>`,
})
export class LoginCallbackComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.supabaseService.getSession().pipe(
      concatMap(({ data, error }) => {
        if (error || !data?.session) {
          this.toastr.error('Google login failed.');
          this.router.navigate(['/login']);
          throw new Error('Session missing');
        }

        const { access_token, refresh_token } = data.session;
        this.supabaseService.saveTokens(access_token, refresh_token);

        // ✅ Wait until this finishes before routing
        return this.supabaseService.getUserProfile();
      })
    ).subscribe({
      next: (profile:any) => {
        console.log('User profile loaded:', profile);
        this.commonService.userName.set(profile.user.name || profile.user.email);
        this.toastr.success('Google login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toastr.error('Something went wrong.');
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
