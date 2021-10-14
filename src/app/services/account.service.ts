import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../model/account.model';
import { map, finalize } from 'rxjs/operators';

const baseUrl = `${environment.BACKEND_HOST}/accounts`

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountSubject : BehaviorSubject<Account>;
  public account : Observable<Account>;


  constructor(
    private router : Router,
    private http : HttpClient
  ) { 
    this.accountSubject = new BehaviorSubject<Account>(null);
    this.account = this.accountSubject.asObservable();
  }

//   public get accountValue(): Account {
//     return this.accountSubject.value;
//   }

//   login(email : string, password : string){
//     return this.http.post<any>(`${baseUrl}/authenticate`, {email, password}, { withCredentials: true})
//       .pipe(map(account => {
//         this.accountSubject.next(account);
//         this.startRefreshTokenTimer();
//         return account;
//         }));
//   }

//   delete(id : string){
//     return this.http.delete(`${baseUrl}/${id}`)
//       .pipe(finalize(() => {
//         if(id === this.accountValue.id){
//           this.logout();
//         }
//       }));
//   }

//   register(account : Account){
//     return this.http.post(`${baseUrl}/register`, account);
//   }

//   verifyEmail(token : string){
//     return this.http.post(`${baseUrl}/verify-email`, { token });
//   }

//   forgotPassword(email : string){
//     return this.http.post(`${baseUrl}/forgot-password`, { email });
//   }

//   validateResetToken(token : string){
//     return this.http.post(`${baseUrl}/validate-reset-token`, { token });
//   }

    forgotPassword(email : string){
        console.log("forgotPassword() called");
        const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/text' })
        };
        return this.http.post(environment.BACKEND_HOST + "/api/v1/forgotPassword", email, httpOptions);
    }
}
