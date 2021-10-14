import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProgressBarModule } from 'angular-progress-bar';
import { HomeService } from '../home/home.service';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { Student } from '../model/student.model';
import { StoryService } from '../story/story.service';

@Component({
  selector: 'app-story-end',
  templateUrl: './story-end.component.html',
  styleUrls: ['./story-end.component.scss']
})
export class StoryEndComponent implements OnInit {
  svg: string;
  safeAvatarSVG: SafeHtml;
  showAvatar: boolean = false;

  constructor(
    private levelProgressBar: ProgressBarModule,
    public levelManagerService: LevelManagerService,
    public storyService: StoryService,
    private http: HttpClient,
    private homeService: HomeService,
    private router: Router,
    private zone: NgZone,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    console.log("story-end component");
    this.levelManagerService.setupStudentInfo();
    this.setNewExpPoints();
    this.levelManagerService.calculateLevelProgressInfo();
    this.updateStudentInfo();
    this.calculateProgressBarValue();
    this.setupAvatarImage();
  }

  setNewExpPoints(){
    this.levelManagerService.studentNewExpPoints = this.levelManagerService.studentInfo.expPoints + this.storyService.storyScore;
  }
 

  updateStudentInfo(){
    this.levelManagerService.updateStudentInfo()
    .subscribe((response: Student)=> {
      localStorage.setItem("user", JSON.stringify(response))
      this.levelManagerService.studentInfo = response;
      this.homeService.sendUpdate("showStudentLevelInfo");
    }); 
  }

 

  calculateProgressBarValue(){
    var completedExpPointsForLevel = this.levelManagerService.studentNewExpPoints - this.levelManagerService.expPointsRequiredForCurrentLevel
    var fullExpPointsForLevel = this.levelManagerService.totalExpPointsRequiredForNextLevel - this.levelManagerService.expPointsRequiredForCurrentLevel; 
    this.levelManagerService.levelProgressBarValue = (completedExpPointsForLevel / fullExpPointsForLevel) * 100;
  }

  replayStory(){
    this.storyService.storySessionModel = null;
    this.zone.run(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([`/story/${this.storyService.storyId}`]);
    });
  }

  backToHome(){
    localStorage.removeItem("storybook");
    this.zone.run(() => {
      this.router.navigate([`/`], { state: { storyDone: true } });
    });
  }

  setupAvatarImage(){
    var avatarData: string = localStorage.getItem("avatarData");
    this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(avatarData);
    this.showAvatar = true;
  }

  passQuiz(){
    // localStorage.removeItem("storybook");
    this.zone.run(() => {
      this.router.navigate([`/story/${this.storyService.storyId}/quiz`]);
    });
  }

}
