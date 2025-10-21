import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { CommonService } from './services/common.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import translationEn from '../../public/i18n/en.json';
import translationTn from '../../public/i18n/tn.json';
import translationKn from '../../public/i18n/kn.json';
import translationHn from '../../public/i18n/hn.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopNavComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Your-Task-Tracker';

  commonService = inject(CommonService);
  translate = inject(TranslateService);
  public curLang = 'en';

  constructor() {
    this.translate.setTranslation('en', translationEn);
    this.translate.setTranslation('tn', translationTn);
    this.translate.setTranslation('kn', translationKn);
    this.translate.setTranslation('hn', translationHn);
    this.translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this.commonService.currentLanguage.subscribe(lang => {
      this.translate.use(lang);
    });
  }
}
