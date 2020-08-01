import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errorMessage;
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  token;

  constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private tokenService: TokenService,
      private router: Router,
      private statusService: StatusService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(){
    this.submitted = true;
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
    this.loading = false;
  }

  get f() { return this.loginForm.controls; }

  handleResponse(data){
    this.tokenService.handle(data.access_token, data.user_id, data.user_status);
    this.statusService.changeAuthStatus(true);
    this.router.navigateByUrl('/profile');
  }

  handleError(error){
    this.errorMessage = "The email or the password is wrong";
  }

}
