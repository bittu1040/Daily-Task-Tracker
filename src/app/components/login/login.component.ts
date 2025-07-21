import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { NgIf } from '@angular/common';
import { LoginPayload, RegisterPayload } from '../../models/interface';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { SupabaseService } from '../../services/supabase.service';
import { NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-login',
  imports: [MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDividerModule,
    NgIf,NgxLoadingModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  commonService = inject(CommonService);
  // authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  supabaseService = inject(SupabaseService);


  isRegistering = false;
  isLoading = false;

  loginForm: LoginPayload = {
    email: '',
    password: ''
  };

  registerForm: RegisterPayload = {
    email: '',
    password: '',
    name: ''
  };
  
  hide = true;
  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  toggleRegister() {
    this.isRegistering = !this.isRegistering;
    this.loginForm = {
      email: '',
      password: ''
    };
    this.registerForm = {
      email: '',
      password: '',
      name: ''
    };
  }
  login() {
    this.isLoading = true;
    this.supabaseService.login(this.loginForm).pipe(
      switchMap((loginResponse: any) => {
        this.supabaseService.saveTokens(loginResponse.access_token, loginResponse.refresh_token);
        return this.supabaseService.getUserProfile();
      })
    ).subscribe({
      next: (profile: any) => {
        this.commonService.userName.set(profile.user.name || profile.user.email);
        this.isLoading = false;
        console.log('User profile loaded:', profile);
        this.toastr.success('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error('Login failed. Please check your credentials.');
      }
    });
  }

  register() {
    const payload = {
      email: this.registerForm.email,
      password: this.registerForm.password,
      name: this.registerForm.name
    };

    this.supabaseService.register(payload).subscribe({
      next: (response: any) => {
        this.toastr.success('Registration successful. Please verify your email.');
        this.toggleRegister();
      },
      error: () => {
        this.toastr.error('Registration failed. Try again.');
      }
    });
  }

  // signInWithGoogle() {
  //   this.supabase.signInWithGoogle();
  // }


  /*
  login() {
    this.authService.login(this.loginForm).pipe(
      switchMap((loginResponse) => {
        this.authService.saveTokens(loginResponse.accessToken, loginResponse.refreshToken);
        return this.authService.getUserProfile(); // Fetch user profile after login
      })
    )
    .subscribe({
      next: (profile) => {
        this.commonService.userName.set(profile.name);
        this.toastr.success('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    })
  }

  register() {
    this.authService.register(this.registerForm).subscribe(
      (response) => {
        this.toastr.success('Registration successful!');
        this.toggleRegister();
      },
      (error) => {
        this.toastr.error('Registration failed!');
      }
    );
  }
*/

}
