import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../home/home.service';
import { AvatarUser } from '../model/avatar-user.model';
import { TeacherQuizSession } from '../model/teacher-quiz-session.model';
import { UserInfo } from '../model/user-info.model';
import { TeacherService } from './teacher.service';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  doneQuizSessions: TeacherQuizSession[] = [];

  constructor(
    private teacherService: TeacherService, 
    private toast: ToastrService,
    private homeService: HomeService
    ) { }

  ngOnInit(): void {
    var userInfo: UserInfo = JSON.parse(localStorage.getItem("avatarUser"));
    if(userInfo){
      this.teacherService.getLatestQuizSessions(userInfo?.studentId).subscribe(response => {
        if(localStorage.getItem("initialLogin") == "null" || !localStorage.getItem("initialLogin")){
          this.toast.success("Welcome Teacher!");
          this.homeService.readMessage("Welcome Teacher");
          localStorage.setItem("initialLogin", "false");
        }
        var notifyTeacher = localStorage.getItem("notifyTeacher");
        if(notifyTeacher == "true"){
          var notifyTeacherMsg = "A student has recently finished a quiz. Click on the 'Quiz Sessions' button to see it!";
          this.toast.success(notifyTeacherMsg);
          this.homeService.readMessage(notifyTeacherMsg);
          localStorage.removeItem("notifyTeacher");
        }
        
        if(response.length){
          for(var i = 0; i < response.length; i++){
            var quizSession: TeacherQuizSession = response[i];
            this.doneQuizSessions.push(quizSession);
          }
        }
        
        localStorage.setItem("studentsQuizSessions", JSON.stringify(response));
      });

    }
  }




}
