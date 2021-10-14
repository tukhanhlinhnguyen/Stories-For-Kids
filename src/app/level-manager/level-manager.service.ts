import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorybookLevel } from '../model/storybook-level.model';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class LevelManagerService {
  storybookLevelReferenceObj: StorybookLevel[] = [];
  storybookLevelCodes: String[] = ['aa','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','Z1','Z2'];
  currentLevelNumber: number = 1;
  maxLevel: number = 29;
  deltaNext: number = 100;
  studentInfo: Student;
  expPointsRequiredForNextLevel: number = 0;
  expPointsRequiredForCurrentLevel: number = 0;
  totalExpPointsRequiredForNextLevel: number = 0;
  expPointsGained: number = 0;
  studentPreviousExpPoints: number = 0;
  studentNewExpPoints: number = 0;
  levelProgressBarValue: number = 0;
  newReadingLevel: string = '';
  isLevelUp: boolean = false;
  private DEFAULTS = {
    level: 1,
    xp: 0,
    cap: 30,
    deltaNext: 50
  };
  storybookReadingLevelToValueRef = {
    "aa": 1,
    "A": 2,
    "B": 3,
    "C": 4,
    "D": 5,
    "E": 6,
    "F": 7,
    "G": 8,
    "H": 9,
    "I": 10,
    "J": 11,
    "K": 12,
    "L": 13,
    "M": 14,
    "N": 15,
    "O": 16,
    "P": 17,
    "Q": 18,
    "R": 19,
    "S": 20,
    "T": 21,
    "U": 22,
    "V": 23,
    "W": 24,
    "X": 25,
    "Y": 26,
    "Z": 27
  }

  constructor(private http: HttpClient) { }

  populateLevelReferenceObj(){
    while(this.currentLevelNumber < this.maxLevel){
      var levelObj: StorybookLevel = this.returnLevelObj(this.currentLevelNumber, this.maxLevel, this.deltaNext);
      this.storybookLevelReferenceObj.push(levelObj);
      this.currentLevelNumber += 1;
  
    }
  }
    
  set = function (xp, deltaNext) {
      return (1 + Math.sqrt(1 + 8 * xp / deltaNext)) / 2;
  };

  getXPtoLevel = function (level, deltaNext) {
      return ((Math.pow(level, 2) - level) * deltaNext) / 2;
  };

  parseByXP = function (xp, cap, deltaNext) {
      xp = xp === undefined ? this.DEFAULTS.xp : xp;
      cap = cap === undefined ? this.DEFAULTS.cap : cap;
      deltaNext = deltaNext === undefined ? this.DEFAULTS.deltaNext : deltaNext;
      var l = this.set(xp, deltaNext);
      l = l > cap ? cap : l;
      var level = Math.floor(l),
      forNext = this.getXPtoLevel(level + 1, deltaNext);
      forNext = l === cap ? Infinity : forNext;
      var toNext = l === cap ? Infinity : forNext - xp;
      var forLast = this.getXPtoLevel(level, deltaNext);
      return {
          levelNumber: level,
          storybookLevelCode: this.storybookLevelCodes[level - 1],
          levelFrac: l,
          xp: xp,
          per: (xp - forLast) / (forNext - forLast),
          requiredExpForNextLevel: forNext,
          requeredExpToNextLevel: toNext,
          requiredExpForLastLevel: forLast
      };
  };

  returnLevelObj(currentLevelNumber, maxLevel, deltaNext){
    var xp = this.getXPtoLevel(currentLevelNumber, deltaNext);
    var parseByXP = this.parseByXP(xp, maxLevel, deltaNext);
    return parseByXP;
  }

  calculateLevelProgressInfo(){
    this.expPointsGained = this.studentNewExpPoints - this.studentPreviousExpPoints;

    this.populateLevelReferenceObj();
    this.storybookLevelReferenceObj = this.storybookLevelReferenceObj;
    var studentReadingLevelCode = this.studentInfo.studentReadingLevel;
    this.storybookLevelReferenceObj.forEach((storybook, index) => {
      if(storybook.storybookLevelCode == studentReadingLevelCode){
        this.expPointsRequiredForNextLevel = storybook.requiredExpForNextLevel - this.studentNewExpPoints
        this.expPointsRequiredForCurrentLevel = storybook.requiredExpForLastLevel;
        this.totalExpPointsRequiredForNextLevel = storybook.requiredExpForNextLevel;
        if(this.expPointsRequiredForNextLevel <= 0){
          this.expPointsRequiredForNextLevel = this.storybookLevelReferenceObj[index + 1].requiredExpForNextLevel - this.studentNewExpPoints;
          this.studentInfo.studentReadingLevel = this.newReadingLevel = this.storybookLevelCodes[storybook.levelNumber].toString();
          this.isLevelUp = true;
          this.totalExpPointsRequiredForNextLevel = this.storybookLevelReferenceObj[index + 1].requiredExpForNextLevel;
          this.expPointsRequiredForCurrentLevel = this.storybookLevelReferenceObj[index + 1].requiredExpForLastLevel;
        }else{
          this.isLevelUp = false;
        }
      }
    })
    this.studentInfo.expPoints = this.studentNewExpPoints;
  }

  setupStudentInfo(){
    // this.studentInfo = JSON.parse(localStorage.getItem("user"))
    this.studentInfo = JSON.parse(localStorage.getItem("avatarUser"));
    this.studentPreviousExpPoints = this.studentInfo.expPoints;
  }

  updateStudentInfo(){
    return this.http.put(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/updateStudent", this.studentInfo)
  }

}
