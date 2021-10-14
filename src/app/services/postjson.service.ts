import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostjsonService {

  private baseUrl = environment.BACKEND_HOST+'/api/v1/story?docPath=';
  private messageSo = new BehaviorSubject<string>("");
  curMessage = this.messageSo.asObservable();
  
  constructor(private http: HttpClient) { }

  changeMessage(mesg){
    this.messageSo.next(mesg);
  }

  getStory(strname): Observable<Object> {
    console.log(`${this.baseUrl}/${strname}`);
    return this.http.get(`${this.baseUrl}/${strname}`,{responseType:'text' as 'json'});
  }
}
