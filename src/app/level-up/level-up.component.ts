import { Component, OnInit } from '@angular/core';
import { lineChartData } from './data';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { ChartDataPoint } from '../model/chart-data-point.model';
import { TeacherService } from '../teacher/teacher.service';
import { TeacherQuizSession } from '../model/teacher-quiz-session.model';
import { LevelUpService } from './level-up.service';
import { WeekRange } from '../model/week-range.model';
import { Student } from '../model/student.model';
import { ProgressBarModule } from 'angular-progress-bar';
import { TeacherQuizSessionResponse } from '../model/teacher-quiz-session-response.model';
import { HomeService } from '../home/home.service';
import { UserInfo } from '../model/user-info.model';

@Component({
  selector: 'app-level-up',
  templateUrl: './level-up.component.html',
  styleUrls: ['./level-up.component.scss', '../home/home.component.scss']
})
export class LevelUpComponent implements OnInit {
  single: ChartDataPoint[];
  lineChartData: any[];
  expPointsForNextLevelData: any[];
  thisWeekPanelOpenState = false;
  lastWeekPanelOpenState = false;
  weeksContainer: WeekRange[] = [];
  studentCurrentReadingLevel: string 
  studentCurrentReadingLevelImage: string;
  studentExpPoints: number;
  displayedColumns: string[] = ['storybook_name', 'quizScore', 'createdDate'];
  view: any[] = [400, 300];
  responsiveVoiceCancelInterval: number | undefined;
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  readingLevelLetterImgs = {
    "aa": "../../assets/icons/BookLevel/svg/bookLevel_aa.svg",
    "A": "../../assets/icons/BookLevel/svg/bookLevel_a.svg",
    "B": "../../assets/icons/BookLevel/svg/bookLevel_b.svg",
    "C": "../../assets/icons/BookLevel/svg/bookLevel_c.svg",
    "D": "../../assets/icons/BookLevel/svg/bookLevel_d.svg",
    "E": "../../assets/icons/BookLevel/svg/bookLevel_e.svg",
    "F": "../../assets/icons/BookLevel/svg/bookLevel_f.svg",
    "G": "../../assets/icons/BookLevel/svg/bookLevel_g.svg",
    "H": "../../assets/icons/BookLevel/svg/bookLevel_h.svg",
    "I": "../../assets/icons/BookLevel/svg/bookLevel_i.svg",
    "J": "../../assets/icons/BookLevel/svg/bookLevel_j.svg",
    "K": "../../assets/icons/BookLevel/svg/bookLevel_k.svg",
    "L": "../../assets/icons/BookLevel/svg/bookLevel_l.svg",
    "M": "../../assets/icons/BookLevel/svg/bookLevel_m.svg",
    "N": "../../assets/icons/BookLevel/svg/bookLevel_n.svg",
    "O": "../../assets/icons/BookLevel/svg/bookLevel_o.svg",
    "P": "../../assets/icons/BookLevel/svg/bookLevel_p.svg",
    "Q": "../../assets/icons/BookLevel/svg/bookLevel_q.svg",
    "R": "../../assets/icons/BookLevel/svg/bookLevel_r.svg",
    "S": "../../assets/icons/BookLevel/svg/bookLevel_s.svg",
    "T": "../../assets/icons/BookLevel/svg/bookLevel_t.svg",
    "U": "../../assets/icons/BookLevel/svg/bookLevel_u.svg",
    "V": "../../assets/icons/BookLevel/svg/bookLevel_v.svg",
    "W": "../../assets/icons/BookLevel/svg/bookLevel_w.svg",
    "X": "../../assets/icons/BookLevel/svg/bookLevel_x.svg",
    "Y": "../../assets/icons/BookLevel/svg/bookLevel_y.svg",
    "Z": "../../assets/icons/BookLevel/svg/bookLevel_z.svg"
  }

  constructor(
      public levelManagerService: LevelManagerService,
      private teacherService: TeacherService,
      public levelUpService: LevelUpService,
      private homeService: HomeService
      ) {
    Object.assign(this, { lineChartData });
  
  }

  ngOnInit(){
    console.log("level-up component");
    this.getLatestQuizSessions();
    this.levelManagerService.populateLevelReferenceObj();
    this.levelManagerService.setupStudentInfo();
    this.levelManagerService.calculateLevelProgressInfo();
    this.responsiveVoiceCancelInterval = this.homeService.disableResponsiveVoice();
  }

  ngOnDestroy(){
    this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
  }

  getLatestQuizSessions(){
    var userInfo : UserInfo = JSON.parse(localStorage.getItem("avatarUser"));
      this.teacherService.getLatestQuizSessions(userInfo?.studentId)
      .subscribe((response: TeacherQuizSessionResponse) => {
        console.log(response);
        if(response?.[0]){
          // response[0] contains current week quiz sessions 
          this.levelUpService.currentWeekQuizSessions = response[0];
          localStorage.setItem("latestQuizSessions", JSON.stringify(response));
          // this.levelUpService.setupWeeksContainer();
          // this.weeksContainer = this.levelUpService.sortQuizSessionsByWeek();
          var student: Student = this.levelUpService.getStudentInfoFromLocalStorage();
          this.studentCurrentReadingLevel = student.studentReadingLevel;
          this.studentExpPoints = student.expPoints;
          this.studentCurrentReadingLevelImage = this.readingLevelLetterImgs[this.studentCurrentReadingLevel];
        }
        if(response?.[1]){
          // response[1] contains last week quiz sessions 
          this.levelUpService.lastWeekQuizSessions = response[1];
        }
       
      });
  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
