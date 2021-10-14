import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/home/home.service';
import { AuthActions } from 'src/app/login/auth-store/actions';
import { AuthenticationStateService } from 'src/app/login/auth-store/auth.state.service';
import { UserInfo } from 'src/app/model/user-info.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent implements OnInit {

  navOpenedSm: boolean = false;
  showTeachersTabs: boolean = true;
  showStudentLevelInfo: boolean = false;
  showProfileDropdown: boolean = false;
  studentInfo: UserInfo;
  username: string;
  private subscriptionSiteHeader: Subscription;
  safeAvatarSVG: SafeHtml;
  studentCurrentReadingLevelImage: string;
  responsiveVoiceCancelInterval: number | undefined;

  readingLevelLetterImgs = {
    "aa": "../../assets/icons/StudentLevel/svg/studentLevel_aa.svg",
    "A": "../../assets/icons/StudentLevel/svg/studentLevel_a.svg",
    "B": "../../assets/icons/StudentLevel/svg/studentLevel_b.svg",
    "C": "../../assets/icons/StudentLevel/svg/studentLevel_c.svg",
    "D": "../../assets/icons/StudentLevel/svg/studentLevel_d.svg",
    "E": "../../assets/icons/StudentLevel/svg/studentLevel_e.svg",
    "F": "../../assets/icons/StudentLevel/svg/studentLevel_f.svg",
    "G": "../../assets/icons/StudentLevel/svg/studentLevel_g.svg",
    "H": "../../assets/icons/StudentLevel/svg/studentLevel_h.svg",
    "I": "../../assets/icons/StudentLevel/svg/studentLevel_i.svg",
    "J": "../../assets/icons/StudentLevel/svg/studentLevel_j.svg",
    "K": "../../assets/icons/StudentLevel/svg/studentLevel_k.svg",
    "L": "../../assets/icons/StudentLevel/svg/studentLevel_l.svg",
    "M": "../../assets/icons/StudentLevel/svg/studentLevel_m.svg",
    "N": "../../assets/icons/StudentLevel/svg/studentLevel_n.svg",
    "O": "../../assets/icons/StudentLevel/svg/studentLevel_o.svg",
    "P": "../../assets/icons/StudentLevel/svg/studentLevel_p.svg",
    "Q": "../../assets/icons/StudentLevel/svg/studentLevel_q.svg",
    "R": "../../assets/icons/StudentLevel/svg/studentLevel_r.svg",
    "S": "../../assets/icons/StudentLevel/svg/studentLevel_s.svg",
    "T": "../../assets/icons/StudentLevel/svg/studentLevel_t.svg",
    "U": "../../assets/icons/StudentLevel/svg/studentLevel_u.svg",
    "V": "../../assets/icons/StudentLevel/svg/studentLevel_v.svg",
    "W": "../../assets/icons/StudentLevel/svg/studentLevel_w.svg",
    "X": "../../assets/icons/StudentLevel/svg/studentLevel_x.svg",
    "Y": "../../assets/icons/StudentLevel/svg/studentLevel_y.svg",
    "Z": "../../assets/icons/StudentLevel/svg/studentLevel_z.svg"
  }

  constructor(
    private route: Router,
    private homeService: HomeService,
    private cdr: ChangeDetectorRef,
    private authStateService: AuthenticationStateService,
    private sanitizer: DomSanitizer
  ) {
    this.subscriptionSiteHeader = this.homeService.getUpdate()
      .subscribe((message) => {
        if (message.text == "showStudentLevelInfo") {
          this.refreshStudentLevelInfo();
        } else if (message.text == "refreshComponent") {
          this.checkLocalStorage();
        }
      });


  }

  ngOnInit(): void {
    this.checkLocalStorage();
    setTimeout(() => {
      this.safeAvatarSVG = this.homeService.getAvatarImage();
    }, 500);
    $(document).click(function (event) {
      var clickover = $(event.target)[0];
      var $navbarDropdown = $("#profile-dropdown-icon")[0];

      if (!$(clickover).is($($navbarDropdown))) {
        this.showProfileDropdown = false;
        this.cdr.detectChanges();
      } else {
        this.showProfileDropdown = true;
        this.cdr.detectChanges();
      }
    }.bind(this));
  }

  ngOnDestroy() {
    this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
  }

  profile() {

    this.route.navigate([`/profile`]);
    $(".navbar-profile-dropdown-section").hide();
  }

  logout() {
    // saving variables 'in progress' quiz
    this.authStateService.authActionDispatcher.next({ type: AuthActions.LOGOUT });
    var studentsQuizSession = localStorage.getItem("studentsQuizSessions");
    var currentQuizQuestionNumber = localStorage.getItem("currentQuizQuestionNumber");
    var currentQuizScore = localStorage.getItem("currentQuizScore");
    var currentQuizSessionId = localStorage.getItem("currentQuizSessionId");

    var currentStorySessionId = localStorage.getItem("currentStorySessionId");
    var currentStoryPageNumber = localStorage.getItem("currentStoryPageNumber");
    var inProgressStorySession = localStorage.getItem("inProgressStorySession");

    // saving variables for teacher notification 
    var user = localStorage.getItem("user");
    var userJSON = null;
    var notifyTeacher = localStorage.getItem("notifyTeacher");


    // clearing localStorage
    localStorage.clear();
    
    // adding back variables if 'notifyTeacher' is present
    if (user != "null" && notifyTeacher == "true") {
      userJSON = JSON.parse(user);
      if (userJSON.userType == "STUDENT") {
        localStorage.setItem("notifyTeacher", "true");
      } else {
        localStorage.removeItem("notifyTeacher");
      }
    }
    // adding back variables if 'in progress' quiz is present 
    if (currentQuizSessionId != "null" && currentQuizSessionId) {
      localStorage.setItem("studentsQuizSessions", studentsQuizSession);
      localStorage.setItem("currentQuizQuestionNumber", currentQuizQuestionNumber);
      localStorage.setItem("currentQuizScore", currentQuizScore);
      localStorage.setItem("currentQuizSessionId", currentQuizSessionId);
    }
    if (currentStorySessionId != "null" && currentStorySessionId) {
      localStorage.setItem("currentStorySessionId", currentStorySessionId);
      localStorage.setItem("currentStoryPageNumber", currentStoryPageNumber);
      localStorage.setItem("inProgressStorySession", inProgressStorySession);
    }
    this.route.navigate(['/login']);
  }

  levelUpPage() {
    this.route.navigate([`/levelUp`]);
    $(".navbar-profile-dropdown-section").hide();
  }

  toggleProfileDropdown() {
    if (!this.showProfileDropdown) {
      // $(".navbar-profile-dropdown-section").css("display", "block");
      this.showProfileDropdown = true;
    } else if (this.showProfileDropdown) {
      // $(".navbar-profile-dropdown-section").css("display", "none");
      this.showProfileDropdown = false;
    }
  }

  checkLocalStorage() {
    // var user = localStorage.getItem("user");
    var user = localStorage.getItem("avatarUser");
    this.username = localStorage.getItem("username");
    if (user) {
      var userJSON = JSON.parse(user);
      if (userJSON.userType == "STUDENT") {
        this.showTeachersTabs = false;
      } else if (userJSON.userType == "TEACHER") {
        this.showTeachersTabs = true;
      }
    }
  }

  refreshStudentLevelInfo() {
    var studentUser = localStorage.getItem("user");
    this.studentInfo = JSON.parse(studentUser);
    this.showStudentLevelInfo = true;
    this.studentCurrentReadingLevelImage = this.readingLevelLetterImgs[this.studentInfo?.studentReadingLevel];
    this.cdr.detectChanges();
  }

  toggleNav() {
    this.navOpenedSm = !this.navOpenedSm;
  }

  closeNavSm() {
    this.navOpenedSm = false;
  }

  showQuizSessions() {
    this.route.navigate([`/quizSessions`]);
  }

  showUploadQuestion() {
    this.route.navigate([`/uploadQuestion`]);
  }

}
