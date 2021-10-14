import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeService } from '../home/home.service';
import { LevelManagerService } from '../level-manager/level-manager.service';
import { StorySession } from '../model/story-session.model';
import { Story } from '../model/story.model';
import { Storybook } from '../model/storybook.model';
import { Student } from '../model/student.model';
import { StoryService } from './story.service';
import { StoryPageWord } from '../model/story-page-word.model';
import { TTSParagraphReader } from '../model/TTS-paragraph-reader.model';
import { StoryPageParagraph } from '../model/story-page.paragraph.model';
import { Paragraph } from '../model/paragraph.model';

enum StoryAudioPlayMethod {
  AUDIO_FILE_OPTION = '1',
  TTS_OPTION = '2'
}

declare let responsiveVoice: any;
declare var $: any;
@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {

  @ViewChild('div_1', { static: false }) wordSpan: ElementRef;

  play: boolean = true;
  story: any = null;
  currentPageAudios: string[] = [];

  // previousPageNumber: number = 0;
  currentPageWords: string[] = [];
  currentPageDOMWords: HTMLElement[];
  changeToNextPage: boolean = false;
  isAudioReady: boolean = true;
  audioElement: HTMLAudioElement;
  images: string[] = []
  storyLength: number = 0;
  state: string = 'inProgress';
  // state: string = 'DONE';
  backendHost: string = environment.BACKEND_HOST;
  showPrevBtn: boolean = false;
  showNextBtn: boolean = true;
  playAudio: boolean = true;
  // startAudio: boolean = false;
  btnPlayClicked: boolean = false;
  storyWords: StoryPageWord[] = [];
  storyParagraphs: StoryPageParagraph[] = [];
  highWord: HTMLElement;
  audioIndex: number = 0;
  remainingAudio: HTMLAudioElement;
  resumeAudio: string = "start";
  pauseAudio: boolean = false;
  waitForAudioLoad: boolean = true;
  isAudioAutoPlay: boolean = false;
  isReachedPageEnd: boolean = false;
  pageImage: string;
  carouselSlide: Element;
  storyAudioPlayMethod: StoryAudioPlayMethod;
  ttsParagraphReader: TTSParagraphReader;
  audioPlaying: boolean = false;
  storyPageImages: string[] = null;
  allAudiosForAudioFiles: string[][] = [];

  //
  audioElements: HTMLAudioElement[] = [];

  // each word reading timing to be filled on the fly :
  // timing: number[] = [1.514667, 0.509334, 1.155792, 0.872, 0.596, 1.139688, 0.912, 0.629334, 0.365334, 0.945083, 0.698667, 0.648, 0.898667, 0.218667, 0.836542, 0.861334, 0.210667, 0.637334, 2.161708];
  timing: number[] = [];

  constructor(
    private storyService: StoryService,
    private homeService: HomeService,
    private levelManagerService: LevelManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
  }

  endStoryState() {

    this.assignStudentNewExpPoints();
    // this.saveStorySession();
    this.updateStudentInfo();
    this.state = 'DONE';
    this.cdr.detectChanges();
  }

  saveStorySession() {
    var storybook: Story = JSON.parse(localStorage.getItem("storybook"));
    var user: Student = JSON.parse(localStorage.getItem("user"));
    if (storybook && user) {
      var storySession = new StorySession();
      storySession.forStorybookId = storybook.storybookId;
      storySession.byStudentId = +user.userId;
      storySession.expPointsEarned = 5 * this.levelManagerService.storybookReadingLevelToValueRef[storybook.storybookReadingLevel];
      this.storyService.storyScore = 5 * this.levelManagerService.storybookReadingLevelToValueRef[storybook.storybookReadingLevel];
      storySession.sessionStatus = 'DONE'
      storySession.createdDate = new Date().getTime();
      storySession.storybookName = storybook.storyName;
    }
    this.storyService.saveStorySession(storySession).subscribe((response) => {
      this.homeService.sendUpdate("showStudentLevelInfo");
    });
  }

  assignStudentNewExpPoints() {
    var storybook: Storybook = JSON.parse(localStorage.getItem("storybook"));
    var expPointsForLevel = this.levelManagerService.storybookReadingLevelToValueRef[this.storyService.storySessionModel.storybookReadingLevel];
    this.storyService.expPointsEarned = 5 * expPointsForLevel;
    this.levelManagerService.studentInfo.expPoints += this.storyService.expPointsEarned;
  }

  updateStudentInfo() {
    this.levelManagerService.updateStudentInfo()
      .subscribe((response: Student) => {
        localStorage.setItem("user", JSON.stringify(response))
        this.levelManagerService.studentInfo = response;
      });
  }

  backToHome() {
    this.router.navigate([`/`], { state: { storyDone: true } });
  }

  backToHome2() {
    this.router.navigate([`/`]);
  }

  ngOnInit(): void {

    var isInProgressStorySession: boolean = false;
    var storybook: Storybook = null;

    //
    // if (localStorage.getItem("storybook")) {
    var storybookString: string = localStorage.getItem("storybook");
    if (storybookString) {

      // storybook = JSON.parse(localStorage.getItem("storybook"));
      storybook = JSON.parse(storybookString);
      if (storybook.inProgressStorySessionId != 0) {

        isInProgressStorySession = true;
        this.storyService.useExistingStorySession(storybook.inProgressStorySessionId, storybook.inProgressStorySessionPageNumber);

      } else if (storybook.inProgressStorySessionId == 0) {

        this.storyService.createStorySession();
      }
    }

    // get info : currentPageNumber, stoppedOnPageNumber, story name, story Id
    this.loadStoryInfo();

    // this.previousPageNumber = 0;

    //
    console.log("ngOnInit > currentPageNumber : " + this.storyService.currentPageNumber);
    this.storyService.getStoryPageData(this.storyService.strname, this.storyService.currentPageNumber, true, isInProgressStorySession).subscribe((response: any) => {

      var storybookString: string = localStorage.getItem("storybook");
      if (storybookString != undefined && storybookString != "null") {

        var storybookObj: Storybook = JSON.parse(storybookString);
        if (storybookObj.hasAudio) {

          this.storyAudioPlayMethod = StoryAudioPlayMethod.AUDIO_FILE_OPTION;
          this.populateSinglePageTTSStoryData(response);
          // this.populateSinglePageStoryData(response, this.storyAudioPlayMethod);

        } else if (!storybookObj.hasAudio) {

          this.storyAudioPlayMethod = StoryAudioPlayMethod.TTS_OPTION;
          this.populateSinglePageTTSStoryData(response);
        }
      }

      // process response of BE API
      this.populateSinglePageStoryData(response, this.storyAudioPlayMethod);

      //
      this.adjustDirectionArrows();
    });

    this.levelManagerService.setupStudentInfo();

    // we are ready to play : btn play & btn pause can be toggled
    setTimeout(() => {

      this.waitForAudioLoad = false;

    }, 3000);
  }

  /* populateParagraphDOMElements() {
    setTimeout(() => {
      var currentPageDOMWords = $("#story-words-page-1").children();
      console.log("currentPageDOMWords: ");
      console.log(currentPageDOMWords);
      console.log(this.storyParagraphs);
      for (var i = 0; i < currentPageDOMWords.length; i++) {
        // this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[i].DOMElement = currentPageDOMWords[i];
        this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[i].DOMElement = $(currentPageDOMWords[i]).children()[0]
      }

    }, 1000);
  } */

  loadStoryInfo() {

    var inProgressStorySession = localStorage.getItem("inProgressStorySession");
    var routeStoryId = +this.route.snapshot.paramMap.get('id');

    // if session in progress fo this story id, get infos and return
    if (inProgressStorySession != "null" && inProgressStorySession) {

      var inProgressStorySessionObj: StorySession = JSON.parse(inProgressStorySession);
      if (routeStoryId && routeStoryId == inProgressStorySessionObj.forStorybookId) {

        this.storyService.currentPageNumber = inProgressStorySessionObj.stoppedOnPageNumber;
        this.storyService.storySessionModel = inProgressStorySessionObj;
        this.storyService.strname = this.storyService.storySessionModel.storybookName;
        this.storyService.storyId = this.storyService.storySessionModel.forStorybookId;
        return;
      }
    }

    // if no session in progress, start from page 1
    if (localStorage.getItem("storybook") != "null") {

      this.storyService.currentPageNumber = 1;
      var cachedStorybook: Story = JSON.parse(localStorage.getItem("storybook"));
      this.storyService.strname = cachedStorybook.storyName;
      this.storyService.storyId = cachedStorybook.storybookId;
    }
  }

  changeAudioContent(autoPlay: boolean) {

    this.isAudioReady = false;
    this.changeToNextPage = true;
    this.storyWords = [];

    //
    this.getDifferentPageStoryData(autoPlay); // get new page. plus also sets word to read to be 1st of page

    // each time we move to next page, we update the story session so we know which page we reached
    this.storyService.storySessionModel.stoppedOnPageNumber = this.storyService.currentPageNumber;
    localStorage.setItem("inProgressStorySession", JSON.stringify(this.storyService.storySessionModel));
    this.isReachedPageEnd = false;
  }

  // YA210930 added fct to be able to restart a book
  firstPageAudioContent() {

    this.isAudioReady = false;
    this.changeToNextPage = true;
    this.storyWords = [];

    // when we click on restart, play should be enabled, and stop should be disabled
    this.resetAudioButtons();

    //
    this.getFirstPageStoryData();

    //
    this.storyService.storySessionModel.stoppedOnPageNumber = this.storyService.currentPageNumber;
    localStorage.setItem("inProgressStorySession", JSON.stringify(this.storyService.storySessionModel));
    this.isReachedPageEnd = false;
  }

  autoPlayAudio(autoPlay: boolean) {

    // set word to read to be 1st of page
    this.audioIndex = 0;

    //
    if (autoPlay === true) {

      this.play = false;
      this.toggleAudio('true');
    }
  }

  resetAudioButtons() {
    this.play = true;
  }

  populateSinglePageTTSStoryData(response: any) {
    console.log(response);
    if (!this.storyPageImages && response?.[1]) {
      this.sortStoryPageImages(response?.[1])
    }
    this.assignStoryPageImage();
    // this.pageImage = environment.BACKEND_HOST + "/stories/" + this.storyService.strname + "/" + this.storyPageImages[this.storyService.currentPageNumber - 1];
  }

  populateSinglePageStoryData(response: any, storyAudioPlayMethod: StoryAudioPlayMethod) {

    console.log(response);

    // var storybookString: string = localStorage.getItem("storybook");
    // var storybookObj: Storybook = null;
    /* if (storybookString != undefined && storybookString != "null") {
      storybookObj = JSON.parse(storybookString);
    } */

    // if(response?.[0]){
    // for text content
    // for splitting based on single words for audio file stories
    // if (storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {
    // this.currentPageWords = response?.[0].value.split(/\s+|،+/);

    //
    response[0].shift();
    
    //
    this.storyLength = response[0].length;

    //
    var allAudioFileStoryText: string[] = response[0];
    this.currentPageWords = allAudioFileStoryText[this.storyService.currentPageNumber - 1].split(/\s+|،+/);

    // filter
    this.currentPageWords = this.currentPageWords.filter(Boolean);
    console.log("populateSinglePageStoryData > this.currentPageWords length : 1 : " + this.currentPageWords.length);

    //
    var emptySpace = this.currentPageWords.indexOf("");
    if (emptySpace > -1) {
      this.currentPageWords.splice(emptySpace, 1);
    }
    console.log("populateSinglePageStoryData > this.currentPageWords length : 2 : " + this.currentPageWords.length);
    // }

    // for splitting based on paragraphs for TTS service stories 
    /* else if (storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {
      // this.currentPageWords = response?.[0].value.split(/\./);
      this.ttsParagraphReader = new TTSParagraphReader()
      this.ttsParagraphReader.currentPageNumber = this.storyService.currentPageNumber - 1;
      this.ttsParagraphReader.currentParagraphNumber = 0;
      this.ttsParagraphReader.forStorybook = storybookObj.storybookId;
      if (response?.[0]) {
        var allParagraphs: string[] = response?.[0];
        this.storyLength = allParagraphs.length - 1;
        this.ttsParagraphReader.totalParagraphNum = response?.[0].length - 1;
        for (var i = 1; i < allParagraphs.length; i++) {
          // start from i = 1 to get rid of story title paragraph 
          var storyParagraph: StoryPageParagraph = new StoryPageParagraph()
          storyParagraph.allSinglePageText = allParagraphs[i];
          // var allSinglePageParagraphs = allParagraphs[i].split(/\./);
          var allSinglePageParagraphs = allParagraphs[i].split(/\.|،+/);
          var allSinglePageParagraphsWithPeriodEnding = allParagraphs[i].split(/\./);
          storyParagraph.allParagraphs = new Array<Paragraph>();
          for (var j = 0; j < allSinglePageParagraphs.length; j++) {
            if (allSinglePageParagraphs[j] != "" && allSinglePageParagraphs[j] != " ") {
              var paragraph = new Paragraph()
              // paragraph.paragraphText = allSinglePageParagraphs[j].substring(1);
              paragraph.paragraphText = allSinglePageParagraphs[j];
              if (allSinglePageParagraphsWithPeriodEnding.includes(allSinglePageParagraphs[j])) {
                paragraph.endingPunctuationMark = ".";
              } else {
                paragraph.endingPunctuationMark = "،";
              }
              storyParagraph.allParagraphs.push(paragraph);
            }
          }
          this.storyParagraphs.push(storyParagraph);
          this.populateParagraphDOMElements();
        }
      }
    } */

    //
    if (response?.[1]) {

      // for image path
      if (!this.storyPageImages && response?.[1]) {

        // this.storyPageImages = response?.[1];
        this.sortStoryPageImages(response?.[1]);
      }

      // prepare page image
      this.assignStoryPageImage();
    }

    //
    if (response?.[2]) {

      // for audio paths
      // console.log(response[2]);
      this.allAudiosForAudioFiles = [];
      var allAudios = response[2];
      var currentPageAudioName = allAudios[0].split("/")[allAudios[0].split("/").length - 2];
      console.log("currentPageAudioName : " + currentPageAudioName);
      var currentPageAudios: string[] = [];
      var currentAudioPageNumber: number = +currentPageAudioName[currentPageAudioName.length - 1];
      for (var i = 0; i < allAudios.length; i++) {

        //
        var iteratingAudioPageName = allAudios[i].split("/")[allAudios[i].split("/").length - 2];
        var iteratingAudioPageNumber: number = +iteratingAudioPageName[iteratingAudioPageName.length - 1];

        // console.log(allAudios[i].split("/").length - 2);
        if (allAudios[i].split("/")[allAudios[i].split("/").length - 2] != currentPageAudioName) {

          //
          this.allAudiosForAudioFiles.push(currentPageAudios);

          //
          currentPageAudios = [];
          currentPageAudios.push(allAudios[i]);

          //
          currentPageAudioName = allAudios[i].split("/")[allAudios[i].split("/").length - 2];

          //
          currentAudioPageNumber = +currentPageAudioName[currentPageAudioName.length - 1];

        } else {

          currentPageAudios.push(allAudios[i]);
        }
      }
      this.allAudiosForAudioFiles.push(currentPageAudios);

      //
      // console.log("currentPageAudios");
      // console.log(currentPageAudios);
      console.log("populateSinglePageStoryData > allAudiosForAudioFiles length : " + this.allAudiosForAudioFiles.length);
      console.log("populateSinglePageStoryData > currentPageAudios length : " + this.currentPageAudios.length);

      //
      this.allAudiosForAudioFiles = this.sortAllAudiosForAudioFiles(this.allAudiosForAudioFiles);

      // this.allAudiosForAudioFiles[this.storyService.currentPageNumber - 1]

      //
      this.setCurrentPageAudios(this.allAudiosForAudioFiles);

      // reset array timings and fill it with get durations on the fly
      /* this.timing = new Array(currentPageAudios.length);
      this.currentPageAudios.map(
        function (url, index) {

          // YA21104 we pass 'this' (the global ts 'this'), so we can use inside the this.timing to fill durations on the fly
          const self = this;

          // define the fct that will fill the durations
          var getDuration = function (next) {

            //
            var fullUrl = environment.BACKEND_HOST + "/stories/" + self.storyService.strname + "/" + url;
            var _player = new Audio(fullUrl);
            _player.addEventListener("durationchange", function (e) {

              // 'this' here refers to audio element _player
              if (this.duration != Infinity) {

                var duration = this.duration;
                _player.remove();
                next(duration); // call our custom fct that will set the durations in the array

              };
            }, false);

            //
            _player.load();
            _player.currentTime = 24 * 60 * 60; // fake big time
            _player.volume = 0;
            // _player.play();
            // waiting...
          }
          // use the duration defined fct to actually fill the durations
          getDuration(function (duration) {

            self.timing[index] = duration;
          });
        },
        this  // YA21104 we pass 'this' (the global ts 'this'), so we can use inside the this.timing to fill durations on the fly
      ); */
    }

    //
    if (response?.[3]) {

      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {

        this.storyLength = response?.[3];
      }
    }
  }

  setCurrentPageAudios(allAudiosForAudioFiles: string[][]) {

    //
    console.log("page num : " + this.storyService.currentPageNumber);
    // console.log("populateSinglePageStoryData > setCurrentPageAudios > allAudiosForAudioFiles length : " + this.allAudiosForAudioFiles.length);
    this.currentPageAudios = /* this. */allAudiosForAudioFiles[this.storyService.currentPageNumber - 1].sort(
      (one, two) =>
      (
        parseInt(one.split('/')[one.split('/').length - 1].replace(/^\D+/g, '')) < parseInt(two.split('/')[two.split('/').length - 1].replace(/^\D+/g, '')) ?
          -1 :
          1
      )
    );

    //
    // console.log(this.storyService.currentPageNumber - 1);
    // console.log(this.currentPageAudios);
    console.log("populateSinglePageStoryData > setCurrentPageAudios > currentPageAudios length : " + this.currentPageAudios.length);
  }

  sortAllAudiosForAudioFiles(allAudiosForAudioFiles: string[][]) {

    var minIndex, len = allAudiosForAudioFiles.length;
    var tempPageArr: string[];
    const NUMERIC_REGEXP = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;
    for (var i = 0; i < len; i++) {

      minIndex = i;
      for (var j = i + 1; j < len; j++) {

        var currentPageArr: string[] = allAudiosForAudioFiles[j][0].split("/");
        var currentPageName: string = currentPageArr[currentPageArr.length - 2];
        var currentPageNumber: number = +currentPageName.match(NUMERIC_REGEXP);
        // var currentPageNumber: number = +currentPageName[currentPageName.length - 1];

        var minIndexPageArr: string[] = allAudiosForAudioFiles[minIndex][0].split("/");
        var minIndexPageName: string = minIndexPageArr[minIndexPageArr.length - 2];
        var minIndexPageNum: number = +minIndexPageName.match(NUMERIC_REGEXP);

        if (currentPageNumber < minIndexPageNum) {

          minIndex = j;
        }
      }
      tempPageArr = allAudiosForAudioFiles[i];
      allAudiosForAudioFiles[i] = allAudiosForAudioFiles[minIndex];
      allAudiosForAudioFiles[minIndex] = tempPageArr;
    }
    return allAudiosForAudioFiles;
  }

  sortStoryPageImages(response: string[]) {

    this.storyPageImages = response.sort((a, b) => {
      return parseInt(a.split('/')[a.split('/').length - 1].replace(/^\D+/g, '')) < parseInt(b.split('/')[b.split('/').length - 1].replace(/^\D+/g, '')) ? -1 : 1;
    });
  }

  getDifferentPageStoryData(autoPlay: boolean) {

    this.storyService.getStoryPageData(this.storyService.strname, this.storyService.currentPageNumber, false).subscribe((response) => {

      // prepare page text (audios?)
      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {

        console.log("getDifferentPageStoryData > currentPageNumber : " + this.storyService.currentPageNumber);
        this.populateSinglePageStoryData(response, this.storyAudioPlayMethod);

      } else if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {

        this.populateSinglePageTTSStoryData(response);
      }

      // prepare page image
      this.assignStoryPageImage();

      //
      setTimeout(() => {

        //
        this.carouselSlide = document.querySelector(".carousel-item");
        this.carouselSlide.classList.remove('animate__animated', 'animate__slideInRight', 'animate__slideInLeft');

        //
        if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {

          this.populateExistingStoryPageParagraphs();
        }

        // auto playing audio (or not). Plus this fct also sets word to read to be 1st of page
        this.autoPlayAudio(autoPlay);

      }, 1000);
    });
  }

  // YA210930 added fct to be able to restart a book
  getFirstPageStoryData() {

    this.storyService.getStoryPageData(this.storyService.strname, this.storyService.currentPageNumber, false).subscribe((response) => {

      // prepare page text (audios?)
      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {

        console.log("getFirstPageStoryData > currentPageNumber : " + this.storyService.currentPageNumber);
        this.populateSinglePageStoryData(response, this.storyAudioPlayMethod);

      } else if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {

        this.populateSinglePageTTSStoryData(response);
      }

      // prepare page image
      this.assignStoryPageImage();

      //
      setTimeout(() => {

        //
        this.carouselSlide = document.querySelector(".carousel-item");
        this.carouselSlide.classList.remove('animate__animated', 'animate__slideInRight', 'animate__slideInLeft');

        //
        if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {

          this.populateExistingStoryPageParagraphs();
        }

        // set word to read to be 1st of page
        this.audioIndex = 0;

      }, 1000);
    });
  }

  assignStoryPageImage() {

    this.pageImage = environment.BACKEND_HOST + "/stories/" + this.storyService.strname + "/" + this.storyPageImages[this.storyService.currentPageNumber - 1];
  }

  wait(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms * 1000)
    }
    );
  }

  paragraphWait(audioPlaying: boolean) {
    var a = this;
    return new Promise<void>((resolve, reject) => {
      (function waitForAudioEnd() {

        if (!audioPlaying) {

          return resolve();
        }

        setTimeout(waitForAudioEnd, 200);
      }.bind(a))();
    })
  }

  populateStoryPageWords() {

    //
    var currentPageDOMWords = $("#story-words-page-1").children();
    console.log("currentPageDOMWords");
    // console.log(currentPageDOMWords);

    //
    this.storyWords = [];
    // var pageWordLength: number = 0;

    // if (this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {
    var pageWordLength = this.currentPageAudios.length;
    for (var i = 0; i < pageWordLength; i++) {

      //
      var pageWord = new StoryPageWord();

      //
      // console.log(currentPageDOMWords[i]);
      // console.log($(currentPageDOMWords[i]).children());
      var domElement = $(currentPageDOMWords[i]).children()[0];
      // console.log(i);
      if (domElement != undefined) {
        // console.log("ok");
        ;
      } else {
        console.log(i);
        console.log(domElement);
      }
      // pageWord.DOMElement = $(currentPageDOMWords[i]).children()[0];
      pageWord.DOMElement = domElement;

      //
      // var audioPath: string = "";
      // if(this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION){
      var audioPath = environment.BACKEND_HOST + "/stories/" + this.storyService.strname + "/" + this.currentPageAudios[i];
      // }
      pageWord.audioPath = audioPath;

      // 
      this.storyWords.push(pageWord);
    }
    // }

    //
    this.changeToNextPage = false;
    this.playAudio = true;
    this.isAudioReady = true;
    this.resumeAudio = "resume";

    //
    return true;
  }

  // TTS only
  populateExistingStoryPageParagraphs() {

    var pageWordLength: number = 0;
    var currentPageDOMWords = $("#story-words-page-1").children();
    pageWordLength = this.ttsParagraphReader.totalParagraphNum = currentPageDOMWords.length;

    for (var i = 0; i < pageWordLength; i++) {

      this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[i].DOMElement = $(currentPageDOMWords[i]).children()[0];
    }
  }

  // TTS only
  populateStoryPageParagraphs() {

    var pageWordLength: number = 0;
    var currentPageDOMWords = $("#story-words-page-1").children();

    pageWordLength = this.ttsParagraphReader.totalParagraphNum = currentPageDOMWords.length;
    for (var i = 0; i < pageWordLength; i++) {

      var pageParagraph = new StoryPageParagraph();
      pageParagraph.DOMElement = $($(currentPageDOMWords[i]).children()[0]).children()[0];

      this.storyParagraphs.push(pageParagraph);
    }

    //
    this.changeToNextPage = false;
    this.playAudio = true;
    this.isAudioReady = true;
    this.resumeAudio = "resume";

    //
    return true;
  }

  removePreviousHighlighting() {

    for (var i = 0; i < this.audioIndex - 1; i++) {

      // find highlighted words and clear them.
      var storyWordBackColor = this.storyWords[i].DOMElement.style.backgroundColor;
      if (storyWordBackColor == "yellow") {
        storyWordBackColor = "";
      }
    }
  }

  checkIfResponsiveVoicePlaying(ms) {
    return new Promise(resolve => {
      setTimeout(function () {
        if (responsiveVoice.isPlaying()) {
          console.log("responsiveVoice is playing!");
        } else {
          console.log("responsiveVoice is not playing!")
        }
      }, ms * 1000);
    });
  }

  async singleWordPlay(storyPageWord: StoryPageWord, audioElement: HTMLAudioElement, timing: number) {

    // resumeAudio : paused | start | resume
    if (this.resumeAudio == "paused") {

      this.remainingAudio.load();
      this.remainingAudio.play();
      await this.wait(1.5);
      this.highWord.style.backgroundColor = "";
      this.resumeAudio = "resume";
    }

    // this.startAudio = true;
    this.audioElement = document.createElement("audio");
    console.log('this.audioElement:', this.audioElement)
    // this.audioElement = audioElement;
    // this.audioElement.setAttribute("autoplay", "true")
    this.audioElement.setAttribute("src", storyPageWord.audioPath);
    // console.log(storyPageWord.audioPath);
    // console.log(this.audioElement.src);
    // this.audioElement.setAttribute("preload", "auto");
    this.audioElement.load();
    // this.audioElement.playbackRate = 0.5;
    await this.audioElement.play(); // .play() is a promise, so let us wait until it returns (means ready to play)

    // highlight the read word
    this.highWord = storyPageWord.DOMElement;
    this.highWord.style.backgroundColor = "yellow";

    // we started reading at least first audio, so we stop spinner
    if (this.btnPlayClicked === true) {
      this.btnPlayClicked = false;
    }

    // make a pause : this pause needs to pause until the current word being read before starting the next one
    this.pauseAudio = true;
    // console.log(this.timing);
    if (timing != undefined) {
      // console.log(timing);
      await this.wait(timing);
    } else {
      console.log("here 4");
      await this.wait(1.5); // why do we have this fist audio always undefined duration?
    }
    // console.log(timing);
    this.pauseAudio = false;

    //
    if (this.playAudio) {

      storyPageWord.DOMElement.style.backgroundColor = "";
      if (this.audioIndex >= (this.storyWords.length - 1)) {

        await this.wait(1);
        this.isReachedPageEnd = true;
      }
    }
  }

  /* async singleWordPlayTTS(storyPageWord: StoryPageWord) {

    if (this.resumeAudio == "paused") {
      this.remainingAudio.load();
      // this.remainingAudio.play();
      responsiveVoice.speak(this.highWord.innerText, "Arabic Male", { rate: 1, volume: 2 });
      await this.wait(1.5);
      this.highWord.style.backgroundColor = "";
      this.resumeAudio = "resume";
    }
    // this.startAudio = true;
    this.audioElement = document.createElement("audio");
    this.audioElement.setAttribute("src", storyPageWord.audioPath);
    this.audioElement.load();
    // this.audioElement.play();
    this.highWord = storyPageWord.DOMElement;
    responsiveVoice.speak(this.highWord.innerText, "Arabic Male", { rate: 1, volume: 2 });
    storyPageWord.DOMElement.style.backgroundColor = "yellow";
    this.pauseAudio = true;
    await this.wait(1.5);
    this.pauseAudio = false;
    if (this.playAudio) {
      storyPageWord.DOMElement.style.backgroundColor = "";
      if (this.audioIndex >= (this.storyWords.length - 1)) {
        await this.wait(1);
        this.isReachedPageEnd = true;
      }
    }
  } */

  async paragraphPlayTTS(storyPageParagraph: StoryPageParagraph) {

    var paragraphWordsLength = storyPageParagraph.DOMElement.innerText.split(" ").length;
    var paragraphPauseDuration = paragraphWordsLength * 0.8;

    if (this.resumeAudio == "paused") {
      this.remainingAudio.load();
      // this.remainingAudio.play();
      responsiveVoice.speak(this.highWord.innerText, "Arabic Male", { rate: 1, volume: 2 });
      // await this.wait(1.5);
      await this.wait(paragraphPauseDuration);
      this.highWord.style.backgroundColor = "";
      this.resumeAudio = "resume";
    }

    // this.startAudio = true;
    this.audioElement = document.createElement("audio");
    console.log('this.audioElement:', this.audioElement)
    // this.audioElement.setAttribute("src", storyPageWord.audioPath);
    // this.audioElement.load();
    // this.audioElement.play();
    this.highWord = storyPageParagraph.DOMElement;
    responsiveVoice.speak(this.highWord.innerText, "Arabic Male", { rate: 1, volume: 2 });
    storyPageParagraph.DOMElement.style.backgroundColor = "yellow";
    this.pauseAudio = true;
    // await this.wait(1.5);
    await this.wait(paragraphPauseDuration);
    this.pauseAudio = false;
    if (this.playAudio) {
      storyPageParagraph.DOMElement.style.backgroundColor = "";
      if (this.audioIndex >= (this.storyWords.length - 1)) {
        await this.wait(1);
        this.isReachedPageEnd = true;
      }
    }
  }

  /* changeTTSStoryPage($direction: string) {

    if ($direction == "next") {

      this.ttsParagraphReader.currentParagraphNumber = 0;
      this.ttsParagraphReader.currentPageNumber += 1;
      this.storyService.currentPageNumber += 1;
      this.getDifferentPageStoryData();

    } else if ($direction == "prev") {

      this.ttsParagraphReader.currentParagraphNumber = 0;
      this.ttsParagraphReader.currentPageNumber -= 1;
      this.storyService.currentPageNumber -= 1;
      this.getDifferentPageStoryData();
    }
  } */

  // paragrah end event for TTS only
  onParagraphAudioEnd() {

    this.audioPlaying = false;
    this.ttsParagraphReader.currentParagraphNumber += 1;
    this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[this.ttsParagraphReader.currentParagraphNumber - 1].DOMElement.style.backgroundColor = "";
    if (this.ttsParagraphReader.currentParagraphNumber >= this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs.length) {

      this.ttsParagraphReader.currentParagraphNumber = 0;
      this.ttsParagraphReader.currentPageNumber += 1;
      this.storyService.currentPageNumber += 1;
      // var nextPageParagraphs = this.storyParagraphs[this.ttsParagraphReader.currentPageNumber - 1].allSinglePageText.split(/\./);
      // this.currentPageWords = nextPageParagraphs;
      if (this.ttsParagraphReader.currentPageNumber >= this.storyLength) {

        this.isReachedPageEnd = true;
        this.endStoryState();
        this.storyService.markSessionAsDone();
        return;
      }

      // get new page. Plus also sets word to read to be 1st of page. Plus start playing automatically
      var lAutoPlay = true;
      this.getDifferentPageStoryData(lAutoPlay);

    } else {

      this.paragraphPlayTTS2(this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[this.ttsParagraphReader.currentParagraphNumber]);
    }
  }

  //
  paragraphPlayTTS2(currentParagraph: Paragraph) {

    currentParagraph.DOMElement.style.backgroundColor = "yellow";
    responsiveVoice.speak(currentParagraph.paragraphText, "Arabic Male", { rate: 1, volume: 2, onend: this.onParagraphAudioEnd.bind(this) })

  }

  /* playStoryParagraphAudioLoop() {
    // for(var i = this.ttsParagraphReader.currentPageNumber; i < this.storyParagraphs.length; i++){
    //   await this.paragraphPlayTTS2(this.storyParagraphs[this.ttsParagraphReader.currentPageNumber]);
    // }
    this.paragraphPlayTTS2(this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[this.ttsParagraphReader.currentParagraphNumber]);
  } */

  async playStoryAudioLoop(audioIndex: number) {

    //
    if (this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION && !this.storyWords.length) {

      // populate storyWords with DOM word to highlight and its audio (url), for the page being read
      this.populateStoryPageWords();
      this.isAudioReady = true;

    } else if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION && !this.storyParagraphs.length) {

      this.populateStoryPageParagraphs();
      this.isAudioReady = true;
    }

    // we can start playing audios
    this.playAudio = true;

    //
    var storyLengthParameter: number = this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION ? this.storyWords.length : this.storyParagraphs.length;

    // TEMP : create the audio ahead
    this.audioElements = [];
    for (var i = audioIndex; i < storyLengthParameter; i++) {
      var audioElement = document.createElement("audio");
      audioElement.autoplay = false;
      // audioElement.setAttribute("autoplay", "false");
      // audioElement.setAttribute("preload", "auto"); // to avoid loading in chunk (http response 206)
      // audioElement.setAttribute("preload", "metadata");
      // audioElement.preload = "metadata";
      audioElement.preload = "auto";
      // audioElement.preload = "none";
      // console.log(this.storyWords[i].audioPath);
      audioElement.setAttribute("src", this.storyWords[i].audioPath);

      // audioElement.setAttribute("controls", "true");
      // audioElement.autoplay = false;
      audioElement.load();

      // console.log(audioElement.duration);
      this.audioElements.push(audioElement);
    }

    // reset array timings and fill it with get durations on the fly
    this.timing = new Array(storyLengthParameter);
    this.currentPageAudios.map(
      function (url, index) {

        // YA21104 we pass 'this' (the global ts 'this'), so we can use inside the this.timing to fill durations on the fly
        const self = this;

        // define the fct that will fill the durations
        var getDuration = function (next) {

          //
          var fullUrl = environment.BACKEND_HOST + "/stories/" + self.storyService.strname + "/" + url;
          var _player = new Audio(fullUrl);
          _player.addEventListener("durationchange", function (e) {

            // 'this' here refers to audio element _player
            if (this.duration != Infinity) {

              var duration = this.duration;
              _player.remove();
              next(duration); // call our custom fct that will set the durations in the array

            };
          }, false);

          //
          _player.load();
          _player.currentTime = 24 * 60 * 60; // fake big time
          _player.volume = 0;
          // _player.play();
          // waiting...
        }
        // use the duration defined fct to actually fill the durations
        getDuration(function (duration) {

          self.timing[index] = duration;
        });
      },
      this  // YA21104 we pass 'this' (the global ts 'this'), so we can use inside the this.timing to fill durations on the fly
    );

    //
    for (var i = audioIndex; i < storyLengthParameter; i++) {

      //
      this.audioIndex = i;

      //
      if (this.playAudio) {

        // await this.singleWordPlay(this.storyWords[i]);
        switch (this.storyAudioPlayMethod) {

          case StoryAudioPlayMethod.AUDIO_FILE_OPTION:
            await this.singleWordPlay(this.storyWords[i], this.audioElements[i], this.timing[i]);
            break;

          case StoryAudioPlayMethod.TTS_OPTION:
            // for single word play TTS 
            // await this.singleWordPlayTTS(this.storyWords[i]);

            // for paragraph play TTS 
            // await this.paragraphPlayTTS(this.storyParagraphs[this.ttsParagraphReader.currentPageNumber])
            await this.paragraphPlayTTS2(this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[this.ttsParagraphReader.currentParagraphNumber]);
            break;

          default:
            break;
        }
        // await this.singleWordPlayTTS(this.storyWords[i]);
      } else {
        break;
      }
    }

    // end of page ?
    if (this.audioIndex >= (this.storyWords.length - 1) && this.isReachedPageEnd) {

      // end of whole story ?
      if (this.storyService.currentPageNumber >= this.storyLength) {

        this.endStoryState();
        this.storyService.markSessionAsDone();

      } else {

        // current page finished, move to next page
        this.isAudioAutoPlay = true;
        this.storyService.currentPageNumber++;
        this.showPrevBtn = true;

        // transitioning
        this.pageImage = null;
        this.currentPageWords = [];

        // load content of next slide and start play
        var lAutoPlay = true;
        this.changeAudioContent(lAutoPlay);

        // slide to new slide
        this.carouselSlide = document.querySelector('.carousel-item');
        this.carouselSlide.classList.add('animate__animated', 'animate__slideInRight');
      }
    }
  }

  async toggleAudio($playAudio) {

    // DBG
    // console.log("this.audioIndex : " + this.audioIndex);
    // console.log("this.playAudio : " + this.playAudio);
    // console.log("this.isAudioReady : " + this.isAudioReady);

    if ($playAudio == "true") {

      // this.startAudio = true;

      // we start the process of reading, so we start spinner
      this.btnPlayClicked = true;

      //
      if (this.playAudio) {

        if (this.isAudioReady) {

          interval(1000)
            .subscribe((val) => {
              if (this.isAudioReady && this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {
                this.removePreviousHighlighting();
                // this.checkIfResponsiveVoicePlaying(1);
              }
            });
        }

        // start playing audios from first word of the page
        this.playStoryAudioLoop(0);

      } else if (!this.playAudio) {

        // start playing audios from current word of the page
        this.playStoryAudioLoop(this.audioIndex);

        //
        if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {
          this.paragraphPlayTTS2(this.storyParagraphs[this.ttsParagraphReader.currentPageNumber].allParagraphs[this.ttsParagraphReader.currentParagraphNumber]);
        }
      }

      // hide during reading/playing the next/previous arrows
      $("#prev-page-btn").hide();
      $("#next-page-btn").hide();

    } else if ($playAudio == "false") {

      // this.audioElement.pause();
      // responsiveVoice.cancel();

      // we stop reading so we stop spinner if any
      this.btnPlayClicked = false;

      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.AUDIO_FILE_OPTION) {

        this.audioElement.pause();
        this.playAudio = false;
        this.resumeAudio = "paused";
        this.remainingAudio = this.audioElement;
        this.highWord.style.backgroundColor = "yellow";
      }

      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {
        responsiveVoice.pause();
      }

      // we show back the next/previous arrows as we stopped reading/playing
      $("#prev-page-btn").show();
      $("#next-page-btn").show();
    }
  }

  // change (move to next or previous) page manually by clicking on arrows
  changeStoryPageManually($direction) {

    this.carouselSlide = document.querySelector('.carousel-item');
    if ($direction == "prev") {

      // move to prev page
      this.storyService.currentPageNumber--;
      
      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {
        this.ttsParagraphReader.currentPageNumber -= 1;
        this.ttsParagraphReader.currentParagraphNumber = 0;
      }

      //
      this.erasePreviousHighlighting();

      // transitioning
      this.pageImage = null;
      this.currentPageWords = [];

      // load content of prev slide but without start play
      var lAutoPlay = false;
      this.changeAudioContent(lAutoPlay);

      //
      this.carouselSlide.classList.add('animate__animated', 'animate__slideInLeft');

    } else if ($direction == "next") {

      // move to next page
      this.storyService.currentPageNumber++;

      // TTS ?
      if (this.storyAudioPlayMethod == StoryAudioPlayMethod.TTS_OPTION) {

        this.ttsParagraphReader.currentPageNumber += 1;
        this.ttsParagraphReader.currentParagraphNumber = 0;
        if (this.ttsParagraphReader.currentPageNumber >= this.storyLength) {

          this.isReachedPageEnd = true;
          this.endStoryState();
          this.storyService.markSessionAsDone();
          return;
        }
      }

      //
      this.erasePreviousHighlighting();

      // transitioning
      this.pageImage = null;
      this.currentPageWords = [];

      // load content of next slide but without start play
      var lAutoPlay = false;
      this.changeAudioContent(lAutoPlay);

      // slide to new slide
      this.carouselSlide.classList.add('animate__animated', 'animate__slideInRight');
    }
    this.adjustDirectionArrows();
  }

  adjustDirectionArrows() {
    if (this.storyService.currentPageNumber == 1) {
      this.showPrevBtn = false;
      this.showNextBtn = true;
    } else if (this.storyService.currentPageNumber >= this.storyLength) {
      this.showPrevBtn = true;
      this.showNextBtn = false;
    }
    else {
      this.showPrevBtn = true;
      this.showNextBtn = true;
    }
  }

  erasePreviousHighlighting() {
    for (var i = 0; i < this.storyWords.length; i++) {
      this.storyWords[i].DOMElement.style.backgroundColor = "";
    }
  }

  async toggleTTS($playAudio) {
    const listspan = this.wordSpan.nativeElement.children;
    if ($playAudio == "true") {
      for (var i = 0; i < this.currentPageWords.length; i++) {
        responsiveVoice.speak(this.currentPageWords[i], "Arabic Male", { rate: 1, volume: 2 });
        listspan[i].style.backgroundColor = "yellow";
        await this.wait(2);
        listspan[i].style.backgroundColor = "";
      }
      $playAudio == false;
    }
    else if ($playAudio == "false") {
      responsiveVoice.pause();
      $playAudio == false;
    }
  }

  // YA210930 added fct to be able to restart a book
  restartStoryPage() {

    this.carouselSlide = document.querySelector('.carousel-item');

    // current page number back to page one
    this.storyService.currentPageNumber = 1;

    this.erasePreviousHighlighting();

    // transitioning
    this.pageImage = null;
    this.currentPageWords = [];

    // Save in progress story session stopped Page Number back to page
    this.firstPageAudioContent();

    // slide to new slide
    this.carouselSlide.classList.add('animate__animated', 'animate__slideInLeft');

    //
    this.adjustDirectionArrows();
  }
}
