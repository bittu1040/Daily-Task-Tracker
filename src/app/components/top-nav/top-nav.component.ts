import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type Theme = 'blue' | 'pink' | 'purple';

@Component({
  selector: 'app-top-nav',
  imports: [MatIconModule, MatMenuModule, NgIf, MatButtonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  currentTheme: Theme = 'blue';
  commonService = inject(CommonService);
  authService = inject(AuthService);
  router = inject(Router);


  constructor() {
    this.loadTheme();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('blue');
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme = theme;
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }
}
