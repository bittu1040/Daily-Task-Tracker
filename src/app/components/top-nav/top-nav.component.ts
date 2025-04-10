import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../models/interface';

type Theme = 'blue' | 'pink' | 'purple';

@Component({
  selector: 'app-top-nav',
  imports: [MatIconModule, MatMenuModule, NgIf, MatButtonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent implements OnInit {
  currentTheme: Theme = 'blue';

  commonService = inject(CommonService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);


  constructor() {
    this.loadTheme();
  };

  ngOnInit() {
    this.getProfile();
  }


  getProfile(){
    if (this.authService.isLoggedIn()) {
      this.authService.getUserProfile().subscribe({
        next: (profile: UserProfile) => {
          this.commonService.userName.set(profile.name);
        },
        error: (error) => {
          console.error('Failed to fetch user profile:', error);
        },
      });
    }
  }


  logout() {
    this.authService.logout();
    this.toastr.info('You have been logged out.');
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
