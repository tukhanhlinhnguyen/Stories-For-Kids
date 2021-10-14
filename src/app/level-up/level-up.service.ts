import { Injectable } from '@angular/core';
import { TeacherQuizSession } from '../model/teacher-quiz-session.model';
import { WeekRange } from '../model/week-range.model';
import { subWeeks, addWeeks } from 'date-fns';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class LevelUpService {
  currentWeekQuizSessions: TeacherQuizSession[];
  lastWeekQuizSessions: TeacherQuizSession[];
  weeksContainer: WeekRange[] = [];

  constructor() { }


  setupWeeksContainer(){
    var currentDay = new Date(); // get current date
    for(var i = 0; i < 2; i++){
      var firstDay = subWeeks(this.getMonday(currentDay), i);
      var lastDay = addWeeks(firstDay, 1);
      var newWeek = new WeekRange;
      newWeek.startDate = new Date(firstDay);
      newWeek.endDate = new Date(lastDay);
      this.weeksContainer.push(newWeek);
    }
  }

  getStudentInfoFromLocalStorage(){
    return JSON.parse(localStorage.getItem("user"));
  }

  sortQuizSessionsByWeek(){
    console.log(this.currentWeekQuizSessions.length);
    var student: Student = this.getStudentInfoFromLocalStorage();
  
    for(var i = 0; i < this.weeksContainer.length; i++){
      var firstDayOfWeek = this.weeksContainer[i].startDate;
      var lastDayOfWeek = this.weeksContainer[i].endDate;
      this.weeksContainer[i].quizSessions = [];
      this.currentWeekQuizSessions.forEach((quizSession, index) => {
        if(this.weeksContainer[i].quizSessions.length >= 5){
          return;
        }
        if(firstDayOfWeek < new Date(quizSession.createdDate) && lastDayOfWeek > new Date(quizSession.createdDate) && quizSession.studentUsername == student.username){
          this.weeksContainer[i].quizSessions.push(quizSession);
          if(this.weeksContainer[i].quizCount){
            this.weeksContainer[i].quizCount += 1;
          }else{
            this.weeksContainer[i].quizCount = 1;
          }
        }else{
          this.weeksContainer[i].quizCount = 0;
        }
      })
    }
   console.log(this.weeksContainer);
    return this.weeksContainer;
  }

  getMonday(date: Date) {
    date = new Date(date);
    var day = date.getDay(),
        diff = date.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }
}
