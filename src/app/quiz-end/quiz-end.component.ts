import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProgressBarModule } from 'angular-progress-bar';
import { environment } from 'src/environments/environment';
import { HomeService } from '../home/home.service';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { StorybookLevel } from '../model/storybook-level.model';
import { Student } from '../model/student.model';
import { QuizService } from '../quiz/quiz.service';

@Component({
  selector: 'app-quiz-end',
  templateUrl: './quiz-end.component.html',
  styleUrls: ['./quiz-end.component.scss']
})
export class QuizEndComponent implements OnInit {
  svg: string;
  safeAvatarSVG: SafeHtml;
  showAvatar: boolean = false;

  constructor(
    private levelProgressBar: ProgressBarModule,
    public levelManagerService: LevelManagerService,
    private quizService: QuizService,
    private http: HttpClient,
    private homeService: HomeService,
    private router: Router,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.levelManagerService.setupStudentInfo();
    this.setNewExpPoints();
    this.levelManagerService.calculateLevelProgressInfo();
    this.updateStudentInfo();
    this.calculateProgressBarValue();
    this.setupAvatarImage();
  }

  setNewExpPoints(){
    this.levelManagerService.studentNewExpPoints = this.levelManagerService.studentInfo.expPoints + this.quizService.quizScore;
  }
 

  updateStudentInfo(){
    this.levelManagerService.updateStudentInfo()
    .subscribe((response: Student)=> {
      localStorage.setItem("user", JSON.stringify(response))
      this.levelManagerService.studentInfo = response;
      this.homeService.sendUpdate("showStudentLevelInfo");
    }); 
  }

  setupAvatarImage(){
    var avatarData: string = localStorage.getItem("avatarData");
    this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(avatarData);
    this.showAvatar = true;
  }

 

  calculateProgressBarValue(){
    var completedExpPointsForLevel = this.levelManagerService.studentNewExpPoints - this.levelManagerService.expPointsRequiredForCurrentLevel
    var fullExpPointsForLevel = this.levelManagerService.totalExpPointsRequiredForNextLevel - this.levelManagerService.expPointsRequiredForCurrentLevel; 
    this.levelManagerService.levelProgressBarValue = (completedExpPointsForLevel / fullExpPointsForLevel) * 100;
  }

  replayQuiz(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([`/story/${this.quizService.quizId}/quiz`]);
  }

  backToHome(){
    this.router.navigate([`/`], { state: { quizDone: true } });
  }
}
