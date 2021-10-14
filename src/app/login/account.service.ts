import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http : HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  getRegisteredUsernames(){
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_USER_ENDPOINT + "/getAllUsernames");
  }
  // forgotPassword(email : string){
  //   console.log("forgotPassword() called");
  //   const httpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/text' })
  //   };
  //   return this.http.post(environment.BACKEND_HOST + "/api/v1/forgotPassword", email, httpOptions);
  // }
}
