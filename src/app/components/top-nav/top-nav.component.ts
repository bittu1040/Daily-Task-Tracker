import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

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
  router = inject(Router);


  constructor() {
    this.loadTheme();
  }

  logout() {
    this.commonService.isLoggedIn.set(false);
    this.router.navigate(['/login']);
    // यहाँ लोकल स्टोरेज से यूजर डेटा क्लियर करें
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
