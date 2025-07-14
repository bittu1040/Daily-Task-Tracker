import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../models/interface';
import { SupabaseService } from '../../services/supabase.service';

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
  // authService = inject(AuthService);
  supabaseService = inject(SupabaseService);
  toastr = inject(ToastrService);


  constructor() {
    this.loadTheme();
  };

  ngOnInit(): void {
    this.loadUserProfile();
  }

  get isLoggedIn(): boolean {
    return !!this.supabaseService.getAccessToken();
  }

  loadUserProfile(): void {
    if (this.isLoggedIn) {
      this.supabaseService.getUserProfile().subscribe({
        next: (profile:any) => {
          this.commonService.userName.set(profile.user.name || profile.user.email);
          console.log('User profile loaded:', profile);
        },
        error: (err) => {
          console.error('Failed to load user profile:', err);
        }
      });
    }
  }

  logout(): void {
    this.supabaseService.logout();
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
