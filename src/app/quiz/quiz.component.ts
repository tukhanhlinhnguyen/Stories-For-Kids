
import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AvatarCreationService } from '../avatar-creation/avatar-creation.service';
import { HomeService } from '../home/home.service';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { Storybook } from '../model/storybook.model';
import { UserAvatarResponse } from '../model/user-avatar-response.model';
import { UserInfo } from '../model/user-info.model';
import { QuizService } from './quiz.service';
import { interval } from 'rxjs';


declare let responsiveVoice: any;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @ViewChild('answerContainer') answerContainer: ElementRef;
  @ViewChild('quizQuestion') quizQuestion: ElementRef;
  storyName: string;
  state: string = 'inProgress';
  // state: string = 'DONE'
  svg: string;
  safeAvatarSVG: SafeHtml;
  showAvatar: boolean = false;
  quizId: string;

  constructor(
    private route: ActivatedRoute,
    public quizService: QuizService,
    private renderer2: Renderer2,
    private levelManagerService: LevelManagerService,
    private homeService: HomeService,
    private avatarCreationService: AvatarCreationService,
    private sanitizer: DomSanitizer
    ) {
   }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id');
    var currentQuizSessionId = localStorage.getItem("currentQuizSessionId");
    var currentQuizScore = localStorage.getItem("currentQuizScore");
    var stoppedOnQuestionNumber = localStorage.getItem("currentQuizQuestionNumber");
    // setTimeout(() => {
    //   this.waitForAudioLoad = false;
    if(localStorage.getItem("storybook")){
      var storybook: Storybook = JSON.parse(localStorage.getItem("storybook"));
      if(storybook.inProgressQuizSessionId != 0){
        this.quizService.useExistingStorySession(storybook.inProgressQuizSessionId, storybook.inProgressQuizSessionPageNumber);
      }
      else if(storybook.inProgressQuizSessionId == 0){
        this.quizService.newCreateQuizSession();
      }
    }
    this.setupAvatarImage();
    this.checkIfAudioPlaying();
  }


  submitAnswer(answer): void {
    // this.state = 'end'; // temp code for developing quiz-end component 
    // 
    // : ElementRef<any>[] 
    var answerOptions: ElementRef<any>[] = this.answerContainer.nativeElement.children;
    var filteredAnswerOptions: ElementRef<any>[] = [];
    for(var i = 0 ; i < answerOptions.length ; i++){
      if(i % 2 != 0){
        filteredAnswerOptions.push(answerOptions[i]);
      }
    }
    console.log(filteredAnswerOptions);
    var currentAnswerOption: any;
    var endQuiz = false;
    if(answer.attributes.correctanswer.value == "true"){
      this.renderer2.setStyle(answer, "background-color", "green", RendererStyleFlags2.Important);
      this.incrementQuizScore();
    }else{
      for(var i = 0; i < filteredAnswerOptions.length; i++){
        currentAnswerOption = filteredAnswerOptions[i];
        if(currentAnswerOption.attributes.correctanswer.value == "true"){
          this.renderer2.setStyle(currentAnswerOption, "background-color", "green", RendererStyleFlags2.Important);
          break;
        }
      }
      this.renderer2.setStyle(answer, "background-color", "red", RendererStyleFlags2.Important);
    }
    for(var i = 0; i < filteredAnswerOptions.length; i++){
      this.renderer2.setStyle(filteredAnswerOptions[i], "pointer-events", "none");
    }
    if(this.quizService.quizProgress >= (this.quizService.quizLength)){
      endQuiz = true;   
    }
    setTimeout(() => {
      this.quizService.quizProgress++;
      this.quizService.quizSessionModel.stoppedOnQuestionNumber = this.quizService.quizProgress;
      // localStorage.setItem("currentQuizQuestionNumber", this.quizService.quizProgress.toString());
      // localStorage.setItem("currentQuizScore", this.quizService.quizScore.toString());
      this.quizService.calculateProgress();
      this.quizService.updateQuizSession();
      this.renderer2.setStyle(answer, "background-color", environment.QUIZ_ANSWER_BTN_DEFAULT_COLOR);
      if(currentAnswerOption){
        this.renderer2.setStyle(currentAnswerOption, "background-color", environment.QUIZ_ANSWER_BTN_DEFAULT_COLOR);
      } 
      for(var i = 0; i < filteredAnswerOptions.length; i++){
        this.renderer2.setStyle(filteredAnswerOptions[i], "pointer-events", "auto");
      }
      if(endQuiz){
        this.quizService.resetQuizVars();
        this.quizService.markSessionAsDone();
        this.state = 'DONE';
        this.quizService.isQuizReady = false;
        // this.router.navigate([`/`], { state: { quizDone: true } });
      }
    }
    , 2000);    
  }

  incrementQuizScore(){
    this.quizService.quizScore += (2 * this.quizService.storybookReadingLevelValue) + 10;
  }



  getKeyByValue(object, value) {
    return +Object.keys(object).find(key => object[key] === value);
  }

  playQuestionAudio(){
    //this.homeService.readMessage(this.quizQuestion.nativeElement.innerHTML);
    responsiveVoice.speak(this.quizQuestion.nativeElement.innerHTML, "Arabic Female", {rate:0.9});
    // console.log(this.quizQuestion.nativeElement.innerHTML);
    // console.log('play question audio');
  }

  async playAnswerOptionsAudio(){
    var answerOptions = this.answerContainer.nativeElement.children;
    for(var i = 0; i < answerOptions.length; i++){
      this.renderer2.setStyle(answerOptions[i], "pointer-events", "none");
    }
    this.readMessage(answerOptions[1].innerHTML, answerOptions[1]).then(() => {
      this.toggleAnswerOptionHighlight(answerOptions[1], false);
    });
    await this.wait(this.quizService.sentenceHighlightDuration);
    this.readMessage(answerOptions[3].innerHTML, answerOptions[3]).then(() => {
      this.toggleAnswerOptionHighlight(answerOptions[3], false);
    });
    await this.wait(this.quizService.sentenceHighlightDuration);

    this.readMessage(answerOptions[5].innerHTML, answerOptions[5]).then(() => {
      this.toggleAnswerOptionHighlight(answerOptions[5], false);
    });
    await this.wait(this.quizService.sentenceHighlightDuration);

    this.readMessage(answerOptions[7].innerHTML, answerOptions[7]).then(() => {
      this.toggleAnswerOptionHighlight(answerOptions[7], false);
    }).then(() => {
      for(var i = 0; i < answerOptions.length; i++){
        this.renderer2.setStyle(answerOptions[i], "pointer-events", "auto");
      }
    })
    // await this.wait(2);
    // }
    // this.renderer2.setStyle(answer, "background-color", "green", RendererStyleFlags2.Important);
  }

  async playSignleAnswerAudio (answerNbr: number){
    var answerOptions = this.answerContainer.nativeElement.children;
    for(var i = 0; i < answerOptions.length; i++){
      this.renderer2.setStyle(answerOptions[i], "pointer-events", "none");
    }
    switch (answerNbr) {
      case 0 :
        this.readMessage(answerOptions[1].innerHTML, answerOptions[1]).then(() => {
          this.toggleAnswerOptionHighlight(answerOptions[1], false);
        }).then(() => {
          for(var i = 0; i < answerOptions.length; i++){
            this.renderer2.setStyle(answerOptions[i], "pointer-events", "auto");
          }
        });
        await this.wait(this.quizService.sentenceHighlightDuration);
        break;
      case 1 : 
        this.readMessage(answerOptions[3].innerHTML, answerOptions[3]).then(() => {
          this.toggleAnswerOptionHighlight(answerOptions[3], false);
        }).then(() => {
          for(var i = 0; i < answerOptions.length; i++){
            this.renderer2.setStyle(answerOptions[i], "pointer-events", "auto");
          }
        });
        await this.wait(this.quizService.sentenceHighlightDuration);
        break;
      case 2 :
        this.readMessage(answerOptions[5].innerHTML, answerOptions[5]).then(() => {
          this.toggleAnswerOptionHighlight(answerOptions[5], false);
        }).then(() => {
          for(var i = 0; i < answerOptions.length; i++){
            this.renderer2.setStyle(answerOptions[i], "pointer-events", "auto");
          }
        });
        await this.wait(this.quizService.sentenceHighlightDuration);
        break;
      case 3 :
        this.readMessage(answerOptions[7].innerHTML, answerOptions[7]).then(() => {
          this.toggleAnswerOptionHighlight(answerOptions[7], false);
        }).then(() => {
          for(var i = 0; i < answerOptions.length; i++){
            this.renderer2.setStyle(answerOptions[i], "pointer-events", "auto");
          }
        });
        await this.wait(this.quizService.sentenceHighlightDuration);
        break;
      default :
        break;
    }
  }

  async readMessage(message: string, answerOption: any){
    var previousColor = answerOption.style.backgroundColor;
    var stopAudioEventListener = false;
    var responsiveVoiceParams = {
      onstart: this.toggleAnswerOptionHighlight(answerOption, true),
    }
    var messageCharLength: number = message.split("").length;
    if(messageCharLength > 0 ){
      this.quizService.sentenceHighlightDuration = 0;
      for(var i = 0 ; i < messageCharLength ; i++){
        this.quizService.sentenceHighlightDuration += 0.105;
      }
    }
    responsiveVoice.speak(message, "Arabic Male", responsiveVoiceParams);
    if(this.quizService.sentenceHighlightDuration > 0){
      console.log("message char length: " + messageCharLength);
      console.log("sentence highlight duration: " + this.quizService.sentenceHighlightDuration);
      await this.wait(this.quizService.sentenceHighlightDuration);
    }else{
      await this.wait(2);
    }
  }

  toggleAnswerOptionHighlight(answerOption: any, isHighlight: boolean){
    if(isHighlight){
      console.log("HIGHLIGHTING ON");
      this.renderer2.setStyle(answerOption, "background-color", "yellow", RendererStyleFlags2.Important);
      this.renderer2.setStyle(answerOption, "color", "black", RendererStyleFlags2.Important);
    }
    else{
      console.log("highlight off");
      this.renderer2.setStyle(answerOption, "background-color", environment.QUIZ_ANSWER_BTN_DEFAULT_COLOR);
      this.renderer2.setStyle(answerOption, "color", "white", RendererStyleFlags2.Important);
    }
  }

  wait(ms: number) {
    return new Promise( resolve => {
      setTimeout(resolve, ms*1000)
    });
  }

  setupAvatarImage(){
    // var avatarUserStr = localStorage.getItem("avatarUser");
    // if(avatarUserStr && avatarUserStr != "null"){
    //   var avatarUser : UserInfo = JSON.parse(avatarUserStr);
    //   if(avatarUser.userAvatarId){
    //     this.avatarCreationService.getExistingAvatarData(avatarUser.userAvatarId)
    //     .subscribe((response : UserAvatarResponse) => {
    //       this.svg = response.avatarData;
    //       this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
    //       this.showAvatar = true;
    //       console.log(response);
    //     });
    //   }
    // }
    var avatarSVGData = localStorage.getItem("avatarData");
    if(avatarSVGData && avatarSVGData != "null"){
      this.svg = avatarSVGData;
      this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
      this.showAvatar = true;
    }
  }

  checkIfAudioPlaying(){
    interval(200)
    .subscribe(() =>{
      if(responsiveVoice.isPlaying()){
        $(".avatar-svg-container").show();
      }else{
        $(".avatar-svg-container").hide();
      }
    });
  }

}
