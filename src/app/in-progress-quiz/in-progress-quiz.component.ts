import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizSession } from '../model/quiz-session.model';

@Component({
  selector: 'app-in-progress-quiz',
  templateUrl: './in-progress-quiz.component.html',
  styleUrls: ['./in-progress-quiz.component.scss']
})
export class InProgressQuizComponent implements OnInit {

  @Input() inProgressQuiz: QuizSession;
  quizReady: boolean = false;
  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.quizReady = true;
  }

  goToQuiz(): void{
    var quizId = this.inProgressQuiz.forQuizId;
    localStorage.setItem("currentQuizSessionId", this.inProgressQuiz.quizSessionId.toString());
    localStorage.setItem("inProgressQuiz", "true");
    this.router.navigate([`/story/${quizId}/quiz`]);
  }

}
