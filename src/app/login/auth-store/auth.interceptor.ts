import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler
  } from '@angular/common/http';
  import { tap } from 'rxjs/operators';
  import { Injectable } from '@angular/core';
  import { Router } from '@angular/router';
import { AuthenticationStateService } from './auth.state.service';
import { AuthActions } from './actions';
  
  @Injectable( )
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private authService:AuthenticationStateService) {}
  
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ):any|void {
      console.log("login auth-interceptor");
      if (req.headers.get('No-Auth') === 'True') {
        return next.handle(req);
      }
      const token = this.authService.getAuth()?.token
      if (token != null) {
        const clonedreq = req.clone({
          headers: req.headers.set(
            'Authorization',
            'Bearer ' + token
          )
        });
        return next.handle(clonedreq).pipe(
          tap(
            succ => {},
            err => {
              if (err.status === 401 || err.status == 403) {
                this.authService.authActionDispatcher.next({ type: AuthActions.LOGOUT });
              }   
            }
          )
        );
      } else {
        return next.handle(req).pipe(
          tap(
            succ => {},
            err => {
              if (err.status === 401 || err.status == 403) {
                this.authService.authActionDispatcher.next({ type: AuthActions.LOGOUT });
              }   
            }
          )
        );
        // this.router.navigateByUrl('/login');
      }
    }
  }