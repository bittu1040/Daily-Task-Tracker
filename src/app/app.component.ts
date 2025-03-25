import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { NgIf } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavComponent, NgIf, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Your-Task-Tracker';

  commonService = inject(CommonService);
}
