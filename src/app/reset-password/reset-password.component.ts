import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ResetPasswordResponse } from '../model/reset-password-response.model';
import { AccountService } from '../services/account.service';
import { confirmPassword } from '../shared/validators/confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  passwordResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;
  resetPasswordToken: string; 

  constructor(
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private toast: ToastrService
    ) {

    this.CurrentState = 'Verified';
    // this.route.params.subscribe(params => {
    //   this.resetToken = params.token;
    //   console.log(this.resetToken);
      
    // });
  }

  get f() { return this.passwordResetForm.controls; }


  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
      this.resetPasswordToken = params.token;
    })
    // this.resetPasswordToken = this.route.snapshot.paramMap.get('token');
    this.Init();
    
  }

  Init() {
    this.passwordResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4)]]
      }, {
        validator: confirmPassword('newPassword', 'confirmPassword')
      }
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }


  ResetPassword(form) {
    var requestBody = {
      newPassword: this.f.newPassword.value,
      confirmPassword: this.f.confirmPassword.value,
      resetPasswordToken: this.resetPasswordToken
    }
    this.http.post(environment.BACKEND_HOST + environment.BACKEND_FORGOTPASSWORD_ENDPOINT + "/resetPassword", requestBody)
    .subscribe((response: ResetPasswordResponse) => {
      if(response.statusCode == "INTERNAL_SERVER_ERROR"){
        this.toast.error(response.message);
      }else if(response.statusCode == "OK"){
        this.toast.success(response.message);
        this.router.navigate([`/`]);
      }
      console.log(response);
    });
  }

  goBackToHome(){
    this.router.navigate([`/`]);
  }
}
