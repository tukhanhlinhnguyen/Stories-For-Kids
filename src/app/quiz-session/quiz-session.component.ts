import { Component, OnInit } from '@angular/core';
import { QuizSession } from '../model/quiz-session.model';
import { TeacherService } from '../teacher/teacher.service';

@Component({
  selector: 'app-quiz-session',
  templateUrl: './quiz-session.component.html',
  styleUrls: ['./quiz-session.component.scss']
})
export class QuizSessionComponent implements OnInit {

  quizSessions: QuizSession[];
  displayedColumns: string[] = ['Storybook Name', 'Student Username', 'Quiz Score', 'Created Date'];
  tableReady: boolean = false;
  items = [];
  pageOfItems: Array<any>;
  constructor(
    private teacherService: TeacherService
  ) { }

  ngOnInit(): void {
    this.quizSessions = [];
    this.teacherService.getAllQuizSessions().subscribe((allQuizSessions: QuizSession[]) => {
      console.log(allQuizSessions);
      this.quizSessions = allQuizSessions;
      this.items = this.quizSessions;

      this.displayTable();
    });
  }

  displayTable(){
    this.tableReady = true;
  }


  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
}
