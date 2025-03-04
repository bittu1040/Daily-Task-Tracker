import { Component } from '@angular/core';


type Theme = 'blue' | 'pink' | 'purple';

@Component({
  selector: 'app-top-nav',
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  currentTheme: Theme = 'blue';

  constructor() {
    this.loadTheme();
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
