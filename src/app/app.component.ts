import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthActions } from './login/auth-store/actions';
import { AuthenticationStateService } from './login/auth-store/auth.state.service';
import { IAuth } from './model/auth.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
declare let responsiveVoice: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  componentDestroyed$: Subject<boolean> = new Subject()

  ngOnDestroy() {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }    

  title = 'uploadStory';
  isLoggedIn = false
  constructor(
    private authStateService: AuthenticationStateService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
  ){
    this.matIconRegistry.addSvgIcon(
      'open_book',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/book-1.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'checked-book-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/book-3.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'in-progress-book-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/book-2.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'in-progress-quiz-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/quiz-2.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'checked-quiz-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/quiz-3.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'open-quiz',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/quiz-1.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'volume-up',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/volume-1.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'volume-muted',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/volume-2.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'superhero-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/icons/superhero-avatar.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'eye-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/imgs/eye.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'eyebrows-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/imgs/eyebrows.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'facial-hair',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/imgs/facial_hair.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'mouth-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/imgs/mouth.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'accessories-icon',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/imgs/accessories.svg')
    );
  }

  ngOnInit(): void {
    console.log("app.component");
    this.authStateService.authStore
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((value: IAuth) => {
      this.isLoggedIn = !(!value?.token) 
    });
 
  }

}

