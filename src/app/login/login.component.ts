import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HomeService } from '../home/home.service';
import { IAuth } from '../model/auth.model';
import { LoginRequest } from '../model/login-request';
import { RegisterRequest } from '../model/register-request';
import { AuthActions } from './auth-store/actions';
import { AuthenticationStateService } from './auth-store/auth.state.service';
import { ToastrService } from 'ngx-toastr';
import { confirmPassword } from '../shared/validators/confirm-password.validator';
import { duplicateUsername } from '../shared/validators/duplicate-username.validator';
import { AccountService } from './account.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    log: boolean = true;
    loginForm: FormGroup;
    regForm: FormGroup;
    componentDestroyed$: Subject<boolean> = new Subject()
    userType = null;
    responsiveVoiceCancelInterval: number | undefined;
    registeredUsernames: string[];
    constructor(
        private formBuilder: FormBuilder,
        private authStateService: AuthenticationStateService,
        private router: Router,
        private toast: ToastrService,
        private accountService: AccountService
    ) {
        this.loginForm = this.formBuilder.group({
            loginUsername: ['', Validators.required],
            password: ['', Validators.required],
        });
        this.regForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            password2: ['', Validators.required],
            userType: ['', Validators.required],
            gender: ['', Validators.required],
            avatarType: ['', Validators.required]
        }, {
            validator: [confirmPassword('password', 'password2'), duplicateUsername('username')]
          });
    }

    get reg() { return this.regForm.controls; }

    ngOnInit() {
        this.clearAllResponsiveVoiceCancelIntervals();
        this.authStateService.authStore
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((value: IAuth) => {
                if(value?.token){
                    this.router.navigate(['/home'])
                }
        })
        this.authStateService.messageStore
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((value: string) => {
            if(value){
                console.log(value);
                if(value == "Registration successful!"){
                    this.toast.success(value);
                    this.log = true;
                    sessionStorage.clear();
                    this.reg.username.setValue("");
                }else if("Login failed:Unauthorized"){
                    this.toast.error("Invalid username/password! Please try again...");
                }else{
                    this.toast.error(value);
                }
                localStorage.removeItem("username");
                this.authStateService.messageStore.next(null)
            }
        })
    }

    getRegisteredUsernames(){
        this.accountService.getRegisteredUsernames().subscribe((response: string[]) => {
            console.log(response);
            this.registeredUsernames = response;
            sessionStorage.setItem("allUsernames", JSON.stringify(response));
            // this.reg.username.setValidators(duplicateUsername(this.registeredUsernames, this.reg.username.value)) 
            // this.regForm.get('username').updateValueAndValidity();  
        });
    }

    // duplicateUsernameMatcher(formArrayName,index)
    // {
    //     console.log("passing duplicateUsernameMatcher()");
    //     return new DuplicateUsernameMatcher(formArrayName,index);
    // }  

    onSubmitLogin(formValue) {
        const payload: LoginRequest = {
            username: formValue.loginUsername,
            password: formValue.password
        };
        localStorage.setItem("username", formValue.loginUsername);
        this.authStateService.authActionDispatcher.next({ type: AuthActions.LOGIN, payload });
    }

    onSubmitReg(regForm) {
        // if(formValue.password !== formValue.password2){
        //     // alert("passwords don't match!")
        //     this.toast.error("Passwords do not match!")
        //     return;
        // }
        // if(!formValue.password || !formValue.username ){
        //     // alert("please fill in the form")
        //     this.toast.error("Username and Password fields must be filled")
        //     return;
        // }
        const payload: RegisterRequest = {
            username: regForm.value.username,
            email: regForm.value.email,
            password: regForm.value.password,
            userType: regForm.value.userType,
            gender: regForm.value.gender,
            avatarType: regForm.value.avatarType
        };
        console.log(payload);
        this.authStateService.authActionDispatcher.next({ type: AuthActions.REGISTER, payload });
    }

    goToForgotPasswordPage(){
        console.log("go to Forgot Password Page");
        this.router.navigate([`/forgotPassword`]);
    }

    clearAllResponsiveVoiceCancelIntervals(){
        const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

        // Clear any timeout/interval up to that id
        for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }
    }

    ngOnDestroy() {
        this.componentDestroyed$.next(true)
        this.componentDestroyed$.complete()
      }    
}