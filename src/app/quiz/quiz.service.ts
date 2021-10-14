import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../model/login-request';
import { LoginUser } from '../model/login-user.model';
import { QuizSession } from '../model/quiz-session.model';
import { Quiz } from '../model/quiz.model';
import * as moment from 'moment';
import { Student } from '../model/student.model';
import { Storybook } from '../model/storybook.model';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { UserInfo } from '../model/user-info.model';
import { AvatarCreationService } from '../avatar-creation/avatar-creation.service';
import { UserAvatarResponse } from '../model/user-avatar-response.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  quiz: Quiz[];
  quizLength: number;
  quizProgress: number;
  quizScore: number;
  quizProgressValue: number = 0;
  quizQuestionCounter: number = 0;
  quizId: number;
  quizSessionModel: QuizSession;
  storybookReadingLevel: string;
  storybookReadingLevelValue: number;
  isExistingQuizSession: boolean = false;
  currentPageNumber: number = 1;
  isQuizReady: boolean = false;
  sentenceHighlightDuration: number = 0;


  constructor(
    private http: HttpClient,
    private levelManagerService: LevelManagerService
    ) { 
      console.log('passing');
    }

  getQuizById(quizId: number): Observable<any>{
    return this.http.get(environment.BACKEND_HOST + "/api/v1/quiz/byQuizId?id=" + quizId)
  }

  calculateProgress(): void{
    // var newQuizProgressValue = (1 - (this.quizQuestionCounter-1/this.quizLength))*100;
    var newQuizProgressValue = (this.quizQuestionCounter / this.quizLength) * 100;
    if(newQuizProgressValue < 0){
      newQuizProgressValue = -newQuizProgressValue;
    }
    this.quizProgressValue = newQuizProgressValue;
    this.quizQuestionCounter += 1;
  }

  resetQuizVars(): void{
    this.quizQuestionCounter = 0;
    this.quizProgressValue = 0;
    this.quiz = [];
  }

  createQuizSession(): void{
    var studentSession = localStorage.getItem("user")
    if(studentSession){
      var studentModel: Student = JSON.parse(studentSession);

      this.quizSessionModel = {
        forQuizId: this.quizId,
        byStudentId: studentModel.studentId,
        quizScore: 0, 
        sessionStatus: "IN_PROGRESS",
        stoppedOnQuestionNumber: 0,
        createdDate: moment.now()
      }
      this.http.post(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT, this.quizSessionModel)
      .subscribe((response: QuizSession) => {
        console.log(response);
      });
    }
  }

  newCreateQuizSession(): void{
    var studentSession = localStorage.getItem("user");
    var cachedStorybook = localStorage.getItem("storybook");
    if(studentSession && cachedStorybook){
      var studentModel: Student = JSON.parse(studentSession);
      var storybook: Storybook = JSON.parse(cachedStorybook);
      this.quizSessionModel = {
        forQuizId: storybook.quizId,
        byStudentId: studentModel?.studentId,
        storybookName: storybook.storyName,
        quizScore: 0, 
        sessionStatus: "IN_PROGRESS",
        stoppedOnQuestionNumber: this.currentPageNumber,
        storybookReadingLevel: storybook.storybookReadingLevel,
        createdDate: moment.now()
      }
      this.http.post(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT, this.quizSessionModel)
      .subscribe((response: QuizSession) => {
        console.log(response);
        this.quizSessionModel.quizSessionId = response.quizSessionId;
        this.quizSessionModel.storybookReadingLevel = response.storybookReadingLevel;
        this.newSetupQuiz();
      });
    }
  }

  newSetupQuiz(): void{
    var quizId = this.quizSessionModel.forQuizId;
    this.getQuizById(quizId).subscribe((quiz) => {
    if (quiz){
      console.log(quiz);
      this.quiz = quiz;
      this.storybookReadingLevel = quiz?.storybookReadingLevel;
      this.quizLength = quiz.questions.length;
      if(this.quizSessionModel.stoppedOnQuestionNumber > this.quizLength){
        // as it is not possible to resume a quiz when it's stopped question number is greater than the quiz length, reset quizProgress to 0 so that the user can start from the beginning 
        this.quizProgress = 1;
        this.quizQuestionCounter = 1;
      }else{
        this.quizProgress = this.quizSessionModel.stoppedOnQuestionNumber;
        this.quizQuestionCounter = this.quizSessionModel.stoppedOnQuestionNumber;
      }
      
      this.quizScore = this.quizSessionModel.quizScore;
      
      this.quizId = +quizId;
      this.calculateStorybookReadingLevelValue();
      this.isQuizReady = true;
      }
    }, (err) => {
      console.log(err);
    })
  }



  calculateStorybookReadingLevelValue(){
    this.storybookReadingLevelValue = this.levelManagerService.storybookReadingLevelToValueRef[this.storybookReadingLevel];
  }

  useExistingStorySession(existingStorySessionId: number, existingStorySessionPageNumber: number): void {
    var studentSession = localStorage.getItem("user");
    var cachedStorybook = localStorage.getItem("storybook");
    if(studentSession && cachedStorybook){
      var studentModel: Student = JSON.parse(studentSession);
      var storybook: Storybook = JSON.parse(cachedStorybook);
      this.quizSessionModel = {
        quizSessionId: existingStorySessionId,
        forQuizId: storybook.storybookId,
        byStudentId: studentModel.studentId,
        storybookName: storybook.storyName,
        quizScore: 0, 
        sessionStatus: "IN_PROGRESS",
        stoppedOnQuestionNumber: existingStorySessionPageNumber,
        storybookReadingLevel: storybook.storybookReadingLevel,
        createdDate: moment.now()
      }
      this.isExistingQuizSession = true;
      this.calculateStorybookReadingLevelValue();
      this.newSetupQuiz();
      this.isQuizReady = true;
    }
  }


  useInProgressQuiz(): void{
    var studentSession = localStorage.getItem("user")
    if(studentSession){
      var studentModel: Student = JSON.parse(studentSession);

      this.quizSessionModel = {
        forQuizId: this.quizId,
        byStudentId: studentModel.studentId,
        quizScore: 0, 
        sessionStatus: "IN_PROGRESS",
        stoppedOnQuestionNumber: 0,
        createdDate: moment.now()
      }
    }
  }
  
  updateQuizSession() { 
    this.http.put(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT + "/updateQuizSession", this.quizSessionModel)
    .subscribe(response => { 
      console.log(response);
    });
  }

  markSessionAsDone(): void{
    this.quizSessionModel.sessionStatus = "DONE";
    this.quizSessionModel.quizScore = this.quizScore;
    this.http.put(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT + "/updateQuizSession", this.quizSessionModel)
    .subscribe(response => {
      if(localStorage.getItem("storybook")){
        var storybook: Storybook = JSON.parse(localStorage.getItem("storybook"));
        storybook.inProgressQuizSessionId = 0;
        storybook.inProgressQuizSessionPageNumber = 0;
        localStorage.setItem("storybook", JSON.stringify(storybook));
      }
      console.log(response);
      localStorage.setItem("notifyTeacher", "true");
    });
  }


  

}
