import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare let responsiveVoice: any;

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private subjectSiteHeader = new Subject<any>();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  sendUpdate(message: string) {
    this.subjectSiteHeader.next({ text: message });
  }

  getUpdate(): Observable<any> {
    return this.subjectSiteHeader.asObservable();
  }

  getAllHomeInfo(username: string, inProgressQuizQuestionNumber?: string, inProgressQuizScore?: string, inProgressStorySessionId?: number) {

    var httpOptions = {

      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
      })
    }
    var requestUrl = environment.BACKEND_HOST + environment.BACKEND_HOME_ENDPOINT + "?username=" + username;
    return this.http.get(requestUrl, httpOptions);
  }

  readMessage(message: string) {
    responsiveVoice.speak(message, "UK English Female", { rate: 1, volume: 2, onend: this.onReadMessageEnd.bind(this) })
    // responsiveVoice.speak(message);
  }

  readMessageUKMale(message: string) {
    responsiveVoice.speak(message, "UK English Male", { rate: 1, volume: 2, onend: this.onReadMessageEnd.bind(this) })
    // responsiveVoice.speak(message);
  }

  onReadMessageEnd() {

    responsiveVoice.cancel();
  }

  disableResponsiveVoice() {
    return window.setInterval(() => {
      responsiveVoice.cancel();
    }, 200);
  }

  enableResponsiveVoice(interval: number | undefined) {

    window.clearInterval(interval);
  }

  getAvatarImage(): SafeHtml {
    var avatarDataStr = localStorage.getItem("avatarData");
    var safeAvatarSVG: SafeHtml;
    if (avatarDataStr && avatarDataStr != "null") {
      var avatarData: string = avatarDataStr;
      safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(avatarData);
    } else {
      safeAvatarSVG = this.sanitizer.bypassSecurityTrustHtml(environment.DEFAULT_AVATAR_DATA);
    }
    return safeAvatarSVG;
  }

  ngOnDestroy() {
    this.enableResponsiveVoice(0);
  }
}
