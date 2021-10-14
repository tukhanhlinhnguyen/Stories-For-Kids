import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PostjsonService } from '../services/postjson.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from '../model/login-user.model';
import { QuizSession } from '../model/quiz-session.model';
import { HomeService } from './home.service';
import { HomeData } from '../model/home-data.model';
import { UserInfo } from '../model/user-info.model';
import { Storybook } from '../model/storybook.model';
import { StorySession } from '../model/story-session.model';
import { Student } from '../model/student.model';
import { UserAvatarResponse } from '../model/user-avatar-response.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SVGToastSanitizePipe } from '../shared/extentions/svg-toast-sanitize-pipe';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
// import {  } from "../shared/services/responsiveVoice-local";
declare let responsiveVoice: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SVGToastSanitizePipe]
})
export class HomeComponent implements OnInit {

  @Input()
  stories: string[]
  name: any;
  strname: any;
  showBg: boolean;
  storybooks: Storybook[];
  storyBooksAsString: string;
  user: LoginUser;
  userInfo: UserInfo;
  teacherLoggedIn: boolean = false;
  studentLoggedIn: boolean = false;
  showInProgressQuiz: boolean = false;
  showInProgressStory: boolean = false;
  inProgressQuiz: QuizSession;
  isStorybooksReady: boolean = false;
  inProgressStory: StorySession;
  showToastMessage: boolean = false;
  safeAvatarSVG: SafeHtml;
  toastMessage: string;
  quizFinishMessage: string;
  storyFinishMessage: string;
  responsiveVoiceCancelInterval: number | undefined;
  allowResponsiveVoice: boolean = false;
  @ViewChild('defaulttoast')
  public toastObj: ToastComponent;

  @ViewChild('quizEndToast')
  public quizEndToastObj: ToastComponent;

  @ViewChild('storyEndToast')
  public storyEndToastObj: ToastComponent;

  public position: ToastPositionModel = { X: "Right" };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private data: PostjsonService,
    private toast: ToastrService,
    private homeService: HomeService,
    private sanitizer: DomSanitizer,
    private svgToastSanitizePipe: SVGToastSanitizePipe
  ) {

    if (this.router.getCurrentNavigation().extras.state?.quizDone) {

      this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
      this.allowResponsiveVoice = true;
      this.quizFinishMessage = "Great job! You have finished the quiz. We will send your results to your teacher now";
      // this.toast.success(this.quizFinishMessage);
      console.log("QUIZ DONE");

      //
      setTimeout(() => {

        if (this.studentLoggedIn) {
          this.quizEndToastObj.show();
          this.homeService.readMessage(this.quizFinishMessage);
        }
      }, 500);

      //
      setTimeout(() => {
        this.allowResponsiveVoice = false;
        console.log("cancelling quizDone responsiveVoice");
        this.homeService.disableResponsiveVoice();
      }, 6000);

    } else if (this.router.getCurrentNavigation().extras.state?.storyDone) {

      this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
      console.log("STORY DONE");
      this.allowResponsiveVoice = true;
      setTimeout(() => {
        if (this.studentLoggedIn) {
          this.storyFinishMessage = "Great job! You have finished the story";
          // this.toast.success(storyFinishMessage);
          this.storyEndToastObj.show();
          this.homeService.readMessage(this.storyFinishMessage);
        }
      }, 500);
      setTimeout(() => {
        this.allowResponsiveVoice = false;
        this.homeService.disableResponsiveVoice();
      }, 6000);
    } else {

      console.log("enable ResponsiveVoice");
      this.allowResponsiveVoice = true;
    }
  }

  ngOnInit(): void {

    //
    var username = localStorage.getItem("username");

    //
    setTimeout(() => {
      this.showBg = true;
    }, 3000);

    // if(localStorage.getItem("initialLogin") == "null" || !localStorage.getItem("initialLogin")){
    //   this.homeService.readMessage("Welcome " + username);
    //   localStorage.setItem("initialLogin", "false");
    // }
    var inProgressQuizSessionId = localStorage.getItem("currentQuizSessionId");
    var inProgressQuizQuestionNumber = localStorage.getItem("currentQuizQuestionNumber");
    var inProgressQuizScore = localStorage.getItem("currentQuizScore");

    var inProgressStorySession = localStorage.getItem("inProgressStorySession");
    var inProgressStorySessionObj: StorySession;
    if (inProgressStorySession != "null" && inProgressStorySession) {
      inProgressStorySessionObj = JSON.parse(inProgressStorySession);
    }

    //
    if (username) {

      // quiz in progress ?
      if (inProgressQuizSessionId != "null" && inProgressQuizQuestionNumber != "null" && inProgressQuizScore != "null") {

        this.homeService.getAllHomeInfo(username, inProgressQuizQuestionNumber, inProgressQuizScore, inProgressStorySessionObj?.storySessionId).subscribe(
          (response: HomeData) => {

            console.log(response);
            this.checkUserType(response.data?.[0]);
            this.storybooks = response.data?.[1];
            this.storyBooksAsString = JSON.stringify(response.data?.[1]);

            //
            if (response.data?.[2]) {

              this.inProgressQuiz = response.data?.[2];
              this.inProgressQuiz.quizSessionId = response.data?.[2].quizSessionId;
              this.inProgressQuiz.storybookName = response.data?.[2].storybookName;
              this.inProgressQuiz.stoppedOnQuestionNumber = response.data?.[2].stoppedOnQuestionNumber;
              this.inProgressQuiz.quizScore = response.data?.[2].quizScore;
              this.showInProgressQuizComponent();
            }

            //
            if (response.data?.[3]) {

              this.inProgressStory = response.data?.[3];
              this.inProgressStory.stoppedOnPageNumber = inProgressStorySessionObj.stoppedOnPageNumber;
              var inProgressSessionStudentId = this.inProgressStory.byStudentId;
              var loggedInStudent = localStorage.getItem("user");
              if (loggedInStudent != "null" && loggedInStudent) {
                var loggedInStudentObject: Student = JSON.parse(loggedInStudent);
                if (+loggedInStudentObject.studentId == inProgressSessionStudentId) {
                  this.showInProgressStoryComponent();
                }
              }
            }

            //
            this.homeService.sendUpdate("refreshComponent");
          }, error => {

            console.log("error:");
            console.log(error);
            this.storybooks = [];
          });

      } else {

        this.homeService.getAllHomeInfo(username).subscribe((response: HomeData) => {

          console.log(response);
          this.checkUserType(response.data[0]);
          this.storybooks = response.data[1];
          this.storyBooksAsString = JSON.stringify(response.data[1]);

          //
          this.homeService.sendUpdate("refreshComponent");
        },
          error => {

            console.log("error:");
            console.log(error);
            this.storybooks = [];
          });
      }
    }

    //
    this.isStorybooksReady = true;
  }

  checkUserType(userInfo: UserInfo): void {

    console.log(userInfo);
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("avatarUser", JSON.stringify(userInfo));
    // console.log(JSON.parse(localStorage.getItem("user"))?.avatarType);
    this.userInfo = userInfo;
    var username = localStorage.getItem("username");

    // if(localStorage.getItem("initialLogin") == ""){
    //   localStorage.setItem("initialLogin", "true");
    //   this.getUserAvatarData();
    // }
    if (userInfo.userType == "TEACHER") {
      this.teacherLoggedIn = true;
      this.studentLoggedIn = false;
    } else if (userInfo.userType == "STUDENT") {
      // if(!localStorage.getItem("studentLoggedIn")){
      //   localStorage.setItem("studentLoggedIn", "true");
      //   localStorage.setItem("userLoggedIn", "true");
      // }
      this.studentLoggedIn = true;
      this.teacherLoggedIn = false;
    }
    if (localStorage.getItem("initialLogin") == "null" || !localStorage.getItem("initialLogin")) {
      this.homeService.readMessage("Welcome " + username);
      this.getUserAvatarData();
      localStorage.setItem("initialLogin", "false");
    } else if (!this.allowResponsiveVoice) {
      this.homeService.disableResponsiveVoice();
    }
  }

  ngOnDestroy() {
    this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
  }

  getUserAvatarData() {
    if (this.userInfo.userAvatarId) {
      this.http.get(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAvatarData/" + this.userInfo.userAvatarId)
        .subscribe((response: UserAvatarResponse) => {
          this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(response.avatarData);
          localStorage.setItem("avatarData", response.avatarData);
          console.log(response);
          if (this.studentLoggedIn) {
            this.toastObj.show();
          }
        });
    } else {
      this.sanitizer.bypassSecurityTrustHtml(environment.DEFAULT_AVATAR_DATA);
      this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(environment.DEFAULT_AVATAR_DATA);
      localStorage.setItem("avatarData", environment.DEFAULT_AVATAR_DATA);
      if (this.studentLoggedIn) {
        this.toastObj.show();
      }
    }

  }

  getInProgressQuiz() {
    var currentUser = localStorage.getItem("user");
    if (currentUser) {
      var studentUserId = JSON.parse(currentUser).userId;
      var inProgressQuizQuestionNumber = localStorage.getItem("currentQuizQuestionNumber");
      var inProgressQuizScore = localStorage.getItem("currentQuizScore");
      if (studentUserId && inProgressQuizQuestionNumber) {
        this.http
          .get(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT + "/byStudentId?studentUserId=" + studentUserId + "&questionNumber=" + inProgressQuizQuestionNumber + "&quizScore=" + inProgressQuizScore)
          .subscribe((response: QuizSession) => {
            this.inProgressQuiz = response;
            this.inProgressQuiz.storybookName = response.storybookName;
            this.inProgressQuiz.stoppedOnQuestionNumber = response.stoppedOnQuestionNumber;
            this.inProgressQuiz.quizScore = response.quizScore;
            this.showInProgressQuizComponent();
          });
      }
    }

  }

  showInProgressStoryComponent() {
    this.showInProgressStory = true;
  }

  showInProgressQuizComponent() {
    this.showInProgressQuiz = true;
  }

  f1(strname) {

    this.strname = strname;
    localStorage.setItem("strname", JSON.stringify(this.strname));
  }

  onBookOpen(book) {

    // store selected story name
    this.f1(book.storyName);

    // go to story
    this.router.navigate([`/story/${book.storyName}`]);
  }

  goToLevelUpComponent() {
    this.router.navigate(['/levelUp']);
  }

  showToast = (): void => {
    this.toastObj.show();
  }
}
