import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { UserInfo } from '../model/user-info.model';
import { AvatarType } from '../model/avatar-type';
import { UserAvatarStatus } from '../model/user-avatar-status';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AvatarCreationService } from './avatar-creation.service';
import { Router } from '@angular/router';
import { UserAvatarResponse } from '../model/user-avatar-response.model';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../home/home.service';
declare let responsiveVoice: any;

@Component({
  selector: 'app-avatar-creation',
  templateUrl: './avatar-creation.component.html',
  styleUrls: ['./avatar-creation.component.scss']
})
export class AvatarCreationComponent implements OnInit {
  RANDOM_STRING_LENGTH = 10;
  ALLOWED_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  svg : string;
  newsteps = [];
  safeAvatarSVG : SafeHtml;
  userInfo: UserInfo;
  avatarType : AvatarType;
  userAvatarStatus : UserAvatarStatus;
  styleOptionsQuery : string = '';
  randomString : string = '';
  loading : boolean = true;
  cancelButtonPath : string = "../../assets/icons/cancel-button.png";
  secondarySelectionButtonInlineStyle : string = "style='width: 40px; background-color: white; padding: 0px; width: 55px; height: 55px'";
  responsiveVoiceCancelInterval: number | undefined;
// NodeJS.Timeout; 
  constructor(
      private sanitizer: DomSanitizer, 
      private http : HttpClient, 
      private avatarCreationService : AvatarCreationService,
      private route : Router,
      private toast : ToastrService,
      private ref: ChangeDetectorRef,
      // private router: Router,
      private homeService: HomeService
    ) { 
    
    this.extractUserInfo();
    if(this.userAvatarStatus == UserAvatarStatus.CREATE_NEW){
      this.randomizeAvatar();
      this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
    }
  }

  ngOnInit(): void {
    // this.testDiceAvatarsAPICall();
    setTimeout(() => {
      this.loading = false;
      setTimeout(() => {
        this.insertAvatarSVG();
      }, 0)
      
    }, 750);

    this.responsiveVoiceCancelInterval = this.homeService.disableResponsiveVoice();
  }

  ngOnDestroy() {
    this.homeService.enableResponsiveVoice(this.responsiveVoiceCancelInterval);
  }

  onReadMessageEnd(){
    responsiveVoice.cancel();
  }

  insertAvatarSVG(){
    const svgRoot = document.getElementById("svg-container");
    $(svgRoot).empty();
    const svgNode = document.createRange().createContextualFragment(this.svg);
    svgRoot.appendChild(svgNode);
  }

  onAvatarTypeSelect(){

  }

  createPrimarySelectionButtons(){

  }

  createSecondarySelectionButtons(){

  }

  generateRandomString(length, chars){
    var result = '';
    for(var i = length; i > 0; --i){
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  generateRobotAPIAvatar(seedString : string){
    var customStyleOptions = "";
    var assignedAvatarType = "";

    this.styleOptionsQuery = "";
    var requestBody = {
      randomString: seedString,
      styleOptions: this.styleOptionsQuery,
      avatarType: this.avatarType
    };
    console.log(this.svg);
    this.http.post(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAvatar", requestBody, { responseType: 'text' })
    .subscribe((response) => {
      this.svg = response;
      this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
      console.log(this.svg);
    });
  }

  generateHumanAPIAvatar(seedString : string, humanToRobotAvatarTypeSwitch?: boolean){
    var customStyleOptions = "";

    this.styleOptionsQuery = "";

    switch(this.userInfo.gender){
      case 'male':
        customStyleOptions += "top[]=shortHair&";
        this.styleOptionsQuery += "top[]=shortHair&";
        break;
      case 'female':
        customStyleOptions += "top[]=longHair&facialHairChance=0&";
        this.styleOptionsQuery += "top[]=longHair&facialHairChance=0&";
        break;
      default: 
        break;
    }
    var requestBody = {
      randomString: seedString,
      styleOptions: this.styleOptionsQuery,
      avatarType: this.avatarType
    };
    console.log(this.svg);
    this.http.post(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAvatar", requestBody, { responseType: 'text' })
    .subscribe((response) => {
      this.svg = response;
      if(humanToRobotAvatarTypeSwitch){
        this.svg = this.svg.replace('mask="url(#avatarsRadiusMask)"', 'mask="url(#avatarsRadiusMask1)"');
      }
      this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
      this.ref.detectChanges();
      console.log(this.svg);
    });
  }

  updateAvatarBasedOnStyleOption(modifySVGData?: boolean){
    console.log("updateAvatarBasedOnStyleOption(): this.randomString: " + this.randomString);
    var requestBody = {
      randomString: this.randomString,
      styleOptions: this.styleOptionsQuery,
      avatarType: this.avatarType
    }
    this.http.post(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAvatar", requestBody, { responseType: 'text' })
    .subscribe((response) => {
      this.svg = response;
      if(modifySVGData){
        this.svg = this.svg.replace('mask="url(#avatarsRadiusMask)"', 'mask="url(#avatarsRadiusMask1)"');
      }
      this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
    });
  }

  randomizeAvatar(humanToRobotAvatarTypeSwitch?: boolean){
    this.randomString = this.generateRandomString(this.RANDOM_STRING_LENGTH, this.ALLOWED_CHARACTERS);
    console.log("randomizeAvatar(): this.randomString: " + this.randomString);
    if(this.avatarType == AvatarType.HUMAN){
      this.generateHumanAPIAvatar(this.randomString, humanToRobotAvatarTypeSwitch);
    }else if(this.avatarType == AvatarType.ROBOT){
      this.generateRobotAPIAvatar(this.randomString);
    }
    
  }

  saveAvatar(){
    var requestBody = {
      avatarSVG: this.svg,
      userId: this.userInfo.userId,
      randomString: this.randomString,
      avatarType: this.avatarType,
      styleOptions: this.styleOptionsQuery
    }
    this.http.post(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/saveAvatar", requestBody)
    .subscribe((response : UserInfo) => {
      console.log(response);
      this.toast.success("Avatar Saved Successfully!");
      localStorage.setItem("avatarData", response.avatarData);
      localStorage.setItem("avatarUser", JSON.stringify(response));
      location.reload();
      $("#responsiveVoice-script").remove();
    });
  }

  regenerateAvatarButtonClick(){
    this.regenerateAvatar(true);
  }

  regenerateAvatar(humanToRobotAvatarTypeSwitch?: boolean){
    this.randomizeAvatar(humanToRobotAvatarTypeSwitch);
    this.insertAvatarSVG();
  }

  removeDuplicateAmpersands(str){
    var newStr = str.replace("&&", "&");
    return newStr;
  }

  addStyleButtonsToSecondarySelectionMenu($event){
    var styleOption = $($event.target).attr("attr-name");
    var secondarySelectionMenu = document.getElementById("secondary-selection-container");
    $("#secondary-selection-container").empty();
    if(styleOption == "avatarType"){
      var humanButton = document.createElement("button");
      humanButton.innerText = "Human";
      humanButton.setAttribute("attr-avatar-type", "human");
      humanButton.setAttribute("class", "btn btn-primary");
      humanButton.addEventListener("click", function(){
        this.avatarType = AvatarType.HUMAN;
        this.regenerateAvatar(true);
        $("#secondary-selection-container").empty();
      }.bind(this));
      secondarySelectionMenu.appendChild(humanButton);

      var robotButton = document.createElement("button");
      robotButton.innerText = "Robot";
      robotButton.setAttribute("attr-avatar-type", "robot");
      robotButton.setAttribute("class", "btn btn-primary");
      robotButton.addEventListener("click", function(){
        this.avatarType = AvatarType.ROBOT;
        this.regenerateAvatar();
        $("#secondary-selection-container").empty();
      }.bind(this));
      secondarySelectionMenu.appendChild(robotButton);
      return;
    }
    var styleOptions = "";
    if(this.avatarType == AvatarType.HUMAN){
      styleOptions = this.avatarCreationService.humanAvatarAPIStyleOptions[styleOption];
    }else if(this.avatarType == AvatarType.ROBOT){
      styleOptions = this.avatarCreationService.robotAvatarAPIStyleOptions[styleOption];
    }

    for (const [key, value] of Object.entries(styleOptions)) {
      var button = null;
      if(this.avatarType == AvatarType.HUMAN){
        button = this.addHumanStyleButtonsToSecondarySelectionMenu(styleOption, key, value);
      }else if(this.avatarType == AvatarType.ROBOT){
        button = this.addRobotStyleButtonsToSecondarySelectionMenu(styleOption, key, value);
      } 
      secondarySelectionMenu.appendChild(button);
    }
    var exitButton : HTMLButtonElement = document.createElement("button");
    exitButton.innerHTML = '&#x1F5D9;';
    exitButton.innerHTML = '&#x238C;\nUndo';
    exitButton.setAttribute("attr-name", styleOption);
    exitButton.setAttribute("aria-hidden", "false");
    exitButton.setAttribute("aria-label", "book icon");
    exitButton.setAttribute("class", "btn btn-primary");
    exitButton.style.width = '55px';
    exitButton.style.height = '55px';
    exitButton.style.backgroundColor = 'background-color: white;';
    exitButton.style.padding = '0px';
    exitButton.addEventListener("click", function(e){
      var styleOptionToDelete = $(e.target).attr("attr-name");
      if(this.styleOptionsQuery.includes(styleOptionToDelete)){
        var styleOptionsArr = this.styleOptionsQuery.split("&");
        var newQuery = "";
        for( var i = 0; i < styleOptionsArr.length; i++){
          if(!styleOptionsArr[i].includes(styleOptionToDelete)){
            newQuery += styleOptionsArr[i] + "&";
          }
        }
        console.log(newQuery);
        this.styleOptionsQuery = newQuery;
        this.updateAvatarBasedOnStyleOption(true);
      }
    }.bind(this));
    secondarySelectionMenu.appendChild(exitButton);

  }

  changeAvatarType(){

  }

  addHumanStyleButtonsToSecondarySelectionMenu(styleOption: string, key: string, value: string){
    var button = document.createElement("button");
    button.addEventListener("click", function(){
      if(this.styleOptionsQuery.includes(styleOption)){
        var queryArr = this.styleOptionsQuery.split(`&`);
        var newQuery = '';
        for(var i = 0; i < queryArr.length; i++){
          if(!queryArr[i].includes(styleOption)){
            newQuery += queryArr[i] + "&"; 	
          }
        }
        console.log(newQuery);
        this.styleOptionsQuery = newQuery;
      }
      if(styleOption in this.avatarCreationService.humanAvatarAPIChanceStyleOptions){
        var styleChanceKey = Object.keys(this.avatarCreationService.humanAvatarAPIChanceStyleOptions[styleOption])[0];
        var styleChanceValue = Object.values(this.avatarCreationService.humanAvatarAPIChanceStyleOptions[styleOption])[0];
        this.styleOptionsQuery += styleChanceKey + "[]=" + styleChanceValue + "&";
      }
      this.styleOptionsQuery += styleOption + "[]=" + key + "&";
      this.styleOptionsQuery = this.removeDuplicateAmpersands(this.styleOptionsQuery);
      console.log("new styleOptionQuery: " + this.styleOptionsQuery);
      this.updateAvatarBasedOnStyleOption(true);
    }.bind(this));
    button.innerHTML = `<img src="${value}" class="secondary-selection-icon" style="width: 40px; background-color: white; padding: 0px; width: 55px; height: 55px;"/>`;
    button.style.backgroundColor = "#ffffff";
    button.classList.add("secondary-selection-button");
    return button
      // secondarySelectionMenu.appendChild(button);
    // }
  }

  addRobotStyleButtonsToSecondarySelectionMenu(styleOption: string, key: string, value: string){
    // button: HTMLButtonElement, 
    var button = document.createElement("button");
    button.addEventListener("click", function(e){
      console.log(e);
      if(this.styleOptionsQuery.includes(styleOption)){
        var queryArr = this.styleOptionsQuery.split(`&`);
        var newQuery = '';
        for(var i = 0; i < queryArr.length; i++){
          if(!queryArr[i].includes(styleOption)){
            newQuery += queryArr[i] + "&"; 	
          }
        }
        console.log(newQuery);
        this.styleOptionsQuery = newQuery;
      }
      if(styleOption in this.avatarCreationService.robotAvatarAPIButtonStyleOptions){
        this.styleOptionsQuery += styleOption + "[]=" + value + "&";
      //   var styleChanceKey = Object.keys(this.avatarCreationService.robotAvatarAPIChanceStyleOptions[styleOption])[0];
      //   var styleChanceValue = Object.values(this.avatarCreationService.robotAvatarAPIChanceStyleOptions[styleOption])[0];
      //   this.styleOptionsQuery += styleChanceKey + "[]=" + styleChanceValue + "&";
      }else{
        this.styleOptionsQuery += styleOption + "[]=" + key + "&";
      }
      
      this.styleOptionsQuery = this.removeDuplicateAmpersands(this.styleOptionsQuery);
      console.log("new styleOptionQuery: " + this.styleOptionsQuery);
      this.updateAvatarBasedOnStyleOption();
    }.bind(this));
    if(styleOption in this.avatarCreationService.robotAvatarAPIButtonStyleOptions){
      button.innerHTML = `<button class="btn btn-primary">${key}</button>`;
    }else{
      button.innerHTML = `<img src="${value}" class="secondary-selection-icon" style="width: 40px; background-color: white; padding: 0px; width: 55px; height: 55px;"/>`;
    }
    button.style.backgroundColor = "#ffffff";
    button.classList.add("secondary-selection-button");
    return button
  }

  extractUserInfo(){
    this.userInfo = JSON.parse(localStorage.getItem("avatarUser"));
    if(this.userInfo.avatarType == "HUMAN"){
      this.avatarType = AvatarType.HUMAN;
    }else if(this.userInfo.avatarType == "ROBOT"){
      this.avatarType = AvatarType.ROBOT;
    }

    if(this.userInfo.userAvatarId){
      this.userAvatarStatus = UserAvatarStatus.USE_EXISTING;

      this.avatarCreationService.getExistingAvatarData(this.userInfo.userAvatarId)
      // this.http.get(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAvatarData/" + this.userInfo.userAvatarId)
      .subscribe((response : UserAvatarResponse) => {
        console.log(response);
        this.svg = response.avatarData;
        this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
        this.randomString = response.randomString;
        this.styleOptionsQuery = response.styleOptions;
        // console.log(response.avatarData);

      });

      // this.svg = this.userInfo.userAvatarId;
      // this.safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(this.svg);
    }else{
      this.userAvatarStatus = UserAvatarStatus.CREATE_NEW;
    }
  }

  deleteStyleOption($event){
    console.log($event);
  }

  showCreateNewAvatarPrompt(){

  }

  backToHome(){
    this.route.navigate([`/`]);
  }

}
