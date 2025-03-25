import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-login',
  imports: [    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isLoggedIn = false;
  username = '';
  loginForm = {
    email: '',
    password: ''
  };


  login() {
    // डमी लॉगिन लॉजिक
    if (this.loginForm.email === 'demo' && this.loginForm.password === 'demo123') {
      this.isLoggedIn = true;
      this.username = this.loginForm.email;
      // यहाँ आप लोकल स्टोरेज में यूजर डेटा सेव कर सकते हैं
    }
  }

}
