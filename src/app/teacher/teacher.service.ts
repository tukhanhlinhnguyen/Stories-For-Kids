import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  ngOnInit(){
    // this.getLatestQuizSessions();
  }

  getLatestQuizSessions(studentId: number): Observable<any>{
    var httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*'
      })
    }
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT + "?studentId=" + studentId, httpOptions);
  }

  getAllQuizSessions(): Observable<any>{
    var httpOptions = {
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*'
      })
    }
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_QUIZSESSION_ENDPOINT + "/allQuizSessions", httpOptions);
  }

}
