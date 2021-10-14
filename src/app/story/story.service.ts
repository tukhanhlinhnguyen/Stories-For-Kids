import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { StorySession } from '../model/story-session.model';
import { Story } from '../model/story.model';
import { Storybook } from '../model/storybook.model';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  strname: string;
  storyId: number = 0;
  studentInfo: Student;
  storyPageNumber: number = 0;
  storyScore: number = 0;
  storyName: string = '';
  storySessionModel: StorySession;
  currentPageNumber: number = 1;
  expPointsEarned: number = 0;
  isExistingStorySession: boolean = false;

  constructor(
    private http: HttpClient,
    private levelManagerService: LevelManagerService
  ) { }

  getLatestStorySessions() {
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYSESSION_ENDPOINT);
  }

  saveStorySession(storySession: StorySession) {
    return this.http.post(environment.BACKEND_HOST + environment.BACKEND_STORYSESSION_ENDPOINT, storySession)
  }

  createStorySession(): void {

    var studentSession = localStorage.getItem("user");
    var cachedStorybook = localStorage.getItem("storybook");

    if (studentSession && cachedStorybook) {

      var studentModel: Student = JSON.parse(studentSession);
      var storybook: Storybook = JSON.parse(cachedStorybook);

      //
      this.storySessionModel = {

        forStorybookId: this.storyId,
        byStudentId: +studentModel.studentId,
        storybookName: this.strname,
        expPointsEarned: 0,
        sessionStatus: "IN_PROGRESS",
        stoppedOnPageNumber: this.currentPageNumber,
        storybookReadingLevel: storybook.storybookReadingLevel,
        createdDate: moment.now()
      }

      //
      this.http.post(environment.BACKEND_HOST + environment.BACKEND_STORYSESSION_ENDPOINT, this.storySessionModel).subscribe(
        (response: StorySession) => {

          if (response) {

            this.storySessionModel.storySessionId = response.storySessionId;
            this.storySessionModel.storybookReadingLevel = response.storybookReadingLevel;
            localStorage.setItem("inProgressStorySession", JSON.stringify(response));
            localStorage.setItem("currentStorySessionId", response.storySessionId.toString());
          }

          //
          localStorage.setItem("currentStoryPageNumber", this.currentPageNumber.toString());
        });
    }
  }

  useExistingStorySession(existingStorySessionId: number, existingStorySessionPageNumber: number): void {
    var studentSession = localStorage.getItem("user");
    var cachedStorybook = localStorage.getItem("storybook");
    if (studentSession && cachedStorybook) {
      var studentModel: Student = JSON.parse(studentSession);
      var storybook: Storybook = JSON.parse(cachedStorybook);
      this.storySessionModel = {
        storySessionId: existingStorySessionId,
        forStorybookId: this.storyId,
        byStudentId: +studentModel.studentId,
        storybookName: this.strname,
        expPointsEarned: 0,
        sessionStatus: "IN_PROGRESS",
        stoppedOnPageNumber: existingStorySessionPageNumber,
        storybookReadingLevel: storybook.storybookReadingLevel,
        createdDate: moment.now()
      }

      this.isExistingStorySession = true;
    }
  }

  markSessionAsDone(): void {
    
    var storySessionId = parseInt(localStorage.getItem("currentStorySessionId"));
    if (!this.isExistingStorySession && storySessionId) {
      this.storySessionModel.storySessionId = storySessionId;
    }
    // if(storySessionId){
    this.storySessionModel.sessionStatus = "DONE";
    this.storySessionModel.expPointsEarned = 5 * this.levelManagerService.storybookReadingLevelToValueRef[this.storySessionModel.storybookReadingLevel];
    localStorage.removeItem("currentStorySessionId");
    localStorage.removeItem("currentStoryPageNumber");
    localStorage.removeItem("inProgressStorySession");

    this.resetStateVars();

    localStorage.setItem("notifyTeacherAboutStorySession", "true");
    this.http.put(environment.BACKEND_HOST + environment.BACKEND_STORYSESSION_ENDPOINT + "/updateStorySession", this.storySessionModel)
      .subscribe(response => {
        if (localStorage.getItem("storybook")) {
          var storybook: Storybook = JSON.parse(localStorage.getItem("storybook"));
          storybook.inProgressStorySessionId = 0;
          storybook.inProgressStorySessionPageNumber = 0;
          localStorage.setItem("storybook", JSON.stringify(storybook));
        }
        console.log(response);
      });
    // }
  }

  resetStateVars() {
    this.currentPageNumber = 1;
  }

  updateStudentInfo() {
    return this.http.put(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/updateStudent", this.studentInfo);
  }

  getAllStoryData(storyName: string) {
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName);
  }

  getStoryPageData(storyName: string, pageNumber: number, isRequestFirstPage: boolean, isInProgressStorySession?: boolean) {

    var user: Student = JSON.parse(localStorage.getItem("user"));
    var studentId = '';
    if (user?.studentId) {
      
      studentId = user?.studentId;

    } else {

      studentId = "0";
    }

    //
    console.log("isRequestFirstPage : " + isRequestFirstPage); 
    if (!isRequestFirstPage) {

      var url1 = environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName + "/" + pageNumber + "/" + studentId;
      console.log("url1 : " + url1); 
      // return this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName + "/" + pageNumber + "/" + studentId);
      return this.http.get(url1);

    } else {

      if (isInProgressStorySession) {

        var inProgressStoryStartPageNumber = this.storySessionModel.stoppedOnPageNumber;
        var url2 = environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName + "/" + pageNumber + "/" + studentId + "?inProgressStoryStartPageNumber=" + inProgressStoryStartPageNumber;
        console.log("url2 : " + url2); 
        // return this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName + "/" + pageNumber + "/" + studentId + "?inProgressStoryStartPageNumber=" + inProgressStoryStartPageNumber);
        return this.http.get(url2);
      }

      //
      var url3 = environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName + "/firstPage/" + studentId;
      console.log("url3 : " + url3); 
      // return this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT + "/" + storyName + "/firstPage/" + studentId);
      return this.http.get(url3);
    }
  }
}
