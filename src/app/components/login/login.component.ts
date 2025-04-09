import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-login',
  imports: [    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDividerModule,
  NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  commonService = inject(CommonService);
  authService = inject(AuthService);
  router = inject(Router);
  toastr= inject(ToastrService);

  isRegistering = false;

  loginForm: LoginPayload = {
    email: '',
    password: ''
  };

  registerForm: RegisterPayload = {
    email: '',
    password: '',
    name: ''
  };

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
    this.authService.login(this.loginForm).pipe(
      switchMap((response) => {
        this.authService.saveTokens(response.accessToken, response.refreshToken);
        return this.authService.getUserProfile(); // Fetch user profile after login
      })
    )
    .subscribe({
      next: (response) => {
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

}
