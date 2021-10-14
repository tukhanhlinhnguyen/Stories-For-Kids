import { Component, Input, OnInit } from '@angular/core';
import { UserInfo } from '../model/user-info.model';
import { Student } from '../model/student.model';
import { LevelManagerService } from './level-manager.service';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-level-manager',
  templateUrl: './level-manager.component.html',
  styleUrls: ['./level-manager.component.scss']
})
export class LevelManagerComponent implements OnInit {

  @Input() userInfo: UserInfo;
  student: Student;

  constructor(
    private levelManagerService : LevelManagerService,
    private homeService: HomeService
    ) { }

  ngOnInit(): void {
    this.setupStudentInfo();
    this.levelManagerService.populateLevelReferenceObj();
    this.calculateStudentReadingLevel();
  }

  setupStudentInfo(): void{
    this.student = new Student;
    this.student.userId = this.userInfo.userId.toString();
    this.student.username = this.userInfo.username;
    this.student.studentId = this.userInfo.studentId.toString();
    this.student.expPoints = this.userInfo.expPoints;
    this.student.studentReadingLevel = this.userInfo.studentReadingLevel;
    this.student.teacher = this.userInfo.teacher;
    this.student.name = this.userInfo.name;
  }

 

  calculateStudentReadingLevel(){
    var levelCounter = 0;
    var studentExpPoints = this.student.expPoints;
    var firstLevelLevelUpPoints = this.levelManagerService.storybookLevelReferenceObj[levelCounter].requiredExpForNextLevel;
    if(studentExpPoints < firstLevelLevelUpPoints){
      this.student.studentReadingLevel = this.levelManagerService.storybookLevelReferenceObj[0].storybookLevelCode;
    }
    else if(studentExpPoints >= firstLevelLevelUpPoints){
      while(studentExpPoints >= this.levelManagerService.storybookLevelReferenceObj[levelCounter].requiredExpForNextLevel){
        levelCounter += 1;
      }
      this.student.studentReadingLevel = this.levelManagerService.storybookLevelReferenceObj[levelCounter].storybookLevelCode;
    }
    this.student["userType"] = "STUDENT";
    localStorage.setItem("user", JSON.stringify(this.student));
    this.homeService.sendUpdate("showStudentLevelInfo");
  }
  

}
