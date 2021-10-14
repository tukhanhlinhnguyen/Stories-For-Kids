import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { AuthActions } from './actions';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAction, IAuth } from "src/app/model/auth.model";
import { LoginRequest } from "src/app/model/login-request";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationStateService{
    authStore: BehaviorSubject<IAuth>;
    messageStore: BehaviorSubject<string>;
    authActionDispatcher: Subject<IAction>;

    handleError = (error: HttpErrorResponse):Observable<HttpErrorResponse> =>{
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
          this.messageStore.next('An error occurred:' + error.error?.message);
        } else {
            this.messageStore.next('Login failed:' + error.error?.error);
            console.error(
            `Backend returned code ${error.status}, ` +
            `body was: `, error.error);
        }
        return of(error);
      }


    constructor(private http: HttpClient) {
        this.authStore = new BehaviorSubject<IAuth>(this.getAuth())
        this.messageStore = new BehaviorSubject<string>(null)
        this.authActionDispatcher = new Subject<IAction>();
        this.authActionDispatcher.subscribe((action: IAction) => {
            switch (action.type) {
                case AuthActions.LOGIN:
                    this.loginUser(action.payload);
                    break;
                case AuthActions.REGISTER:
                    this.register(action.payload);
                    break;
                case AuthActions.LOGOUT:
                    this.authStore.next(null);
                    this.logoutUser();
            }
        });
    }
    
    loginUser(request: LoginRequest) {
        // var httpOptions = {
        //     headers: new HttpHeaders({ 
        //       'Access-Control-Allow-Origin':'*',
        //       "Access-Control-Allow-Credentials": "true",
        //       "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        //       "Access-Control-Allow-Headers": "*",
        //     //   "No-Auth": "true"
        //     })
        //   }
        this.http.post<any>(
                environment.BACKEND_HOST+ '/api/v1/auth/authenticate', 
                request, 
                {headers:{'No-Auth':'True'}}
                // httpOptions
                )
            .pipe(
                catchError(this.handleError)
            ).subscribe(response => {
                const auth: IAuth = {token: response?.token, roles: response?.roles}
                localStorage.setItem('readauth', JSON.stringify(auth));
                this.authStore.next(auth);
            })
    }

    register(request: LoginRequest) {
        this.http.post<any>(
                environment.BACKEND_HOST+ '/api/v1/auth/register', 
                request, 
                {headers:{'No-Auth':'True'}})
            .pipe(
                catchError(this.handleError)
            ).subscribe(response => {
                if(response?.user){
                    this.messageStore.next("Registration successful!");
                }
            })
    }

    logoutUser() {
        localStorage.removeItem('readauth');
    }

    isLoggedIn(): boolean {
        return !(!this.getAuth())
    }

    hasRole(role): boolean {
        return this.getAuth()?.roles.indexOf(role) > -1
    }

    getAuth(): IAuth{
        return JSON.parse(localStorage.getItem('readauth'))
    }
}