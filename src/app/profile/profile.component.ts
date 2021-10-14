import { Component, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  safeAvatarSVG: SafeHtml;
  responsiveVoiceCancelInterval: number | undefined;

  constructor(
    private route : Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.safeAvatarSVG = this.homeService.getAvatarImage();
    }, 500);

    this.responsiveVoiceCancelInterval = this.homeService.disableResponsiveVoice();

  }

  ngOnDestroy() {
    this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
  }


  goToAvatarCreationPage(){
    this.route.navigate([`/profile/avatarCreation`])
  }

  backToHome(){
    this.route.navigate([`/`]);
  }

}
