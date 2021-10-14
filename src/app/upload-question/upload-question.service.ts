import { HttpClient } from '@angular/common/http';
import { Injectable, Input, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddQuestion } from '../model/add-question.model';


@Injectable({
  providedIn: 'root'
})
export class UploadQuestionService {
 

  constructor(
    private http: HttpClient
    ) { 
   }

  saveNewQuestion(addQuestionModel: AddQuestion): Observable<any>{
    return this.http.post(environment.BACKEND_HOST + environment.BACKEND_QUIZ_ENDPOINT + "/uploadQuestion", addQuestionModel)
  }
}
 
