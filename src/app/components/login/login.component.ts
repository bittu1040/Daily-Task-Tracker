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



interface User {
  email: string;
  password: string;
}

interface RegisterUser extends User {
  confirmPassword: string;
  name: string;
}

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
  router = inject(Router);
  isRegistering = false;

  loginForm: User = {
    email: '',
    password: ''
  };

  registerForm: RegisterUser = {
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  };


  login() {
    // डमी लॉगिन लॉजिक
    if (this.loginForm.email === 'bittu@gmail.com' && this.loginForm.password === '123456') {
      this.commonService.isLoggedIn.set(true);
      this.router.navigate(['/dashboard']);
      // यहाँ आप लोकल स्टोरेज में यूजर डेटा सेव कर सकते हैं
    }
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
      confirmPassword: '',
      name: ''
    };
  }

  register() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // For demo purposes, just show an alert and switch to login
    alert('Registration successful! Please login with the demo account.');
    this.isRegistering = false;
  }

}
