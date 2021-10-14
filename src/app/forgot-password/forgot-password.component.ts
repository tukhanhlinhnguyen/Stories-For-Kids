import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize, map, catchError } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { AlertService } from '../alert/alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ForgotPasswordResponse } from '../model/forgot-password-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading : boolean = false;
  submitted : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get f() { return this.form.controls; }

  backToLoginPage(){
    this.router.navigate([`/login`]);
  }

  onSubmit(){
    this.alertService.clear();
    if(this.form.invalid){
      return; 
    }
    this.loading = true; 
    this.alertService.clear();
    this.accountService.forgotPassword(this.f.email.value)
      .subscribe((response : ForgotPasswordResponse) => {
        console.log(response);
        if(response.statusCode == "INTERNAL_SERVER_ERROR"){
          this.toast.error(response.message);
        }else if(response.statusCode == "OK"){
          this.toast.success(response.message);
          this.submitted = true; 
        }
        this.loading = false;
      });
  }

}
