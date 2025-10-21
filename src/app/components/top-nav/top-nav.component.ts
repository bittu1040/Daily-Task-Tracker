
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../models/interface';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Theme = 'blue' | 'pink' | 'purple' | 'gold';

@Component({
  selector: 'app-top-nav',
  imports: [MatIconModule, MatMenuModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent implements OnInit {
  currentTheme: Theme = 'blue';
  curLang:string='en';

  commonService = inject(CommonService);
  // authService = inject(AuthService);
  supabaseService = inject(SupabaseService);
  toastr = inject(ToastrService);

  options = [
    { value: 'en', text: 'English' },
    { value: 'hn', text: 'Hindi' },
    { value: 'kn', text: 'Kanada' },
    { value: 'tn', text: 'Tamil' },
  ];
isMobile = false;
  constructor() {
    this.loadTheme();
    this.checkScreenWidth()
  };

  ngOnInit(): void {
    this.loadUserProfile();
  }


  loadUserProfile(): void {
    if (this.supabaseService.isLoggedIn()) {
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

  switchLan(){
    this.commonService.language.next(this.curLang);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth < 480;
  }
}
