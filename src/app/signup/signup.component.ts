import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { StatusService } from '../services/status.service';
import countries from '../../assets/countries.json';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public errorMessage;
  signupForm: FormGroup;
  submitted = false;
  loading = false;
  tooManyCharEmail = false;
  tooManyCharUsername = false;
  countryList = countries;
  countryWrong = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private statusService: StatusService
    ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      country: null,
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
  }

  onSubmit(){
    this.submitted = true;

    if(this.signupForm.value["email"].length < 31){
      this.tooManyCharEmail = false;
      if(this.signupForm.value["username"].length < 31){
        this.tooManyCharUsername = false;
        if(this.signupForm.value["country"] != null){
          this.loading = true;
          this.authService.signUp(this.signupForm.value).subscribe(
            data => this.handleResponse(data),
            error => this.handleError(error)
          );
        }else{
          this.countryWrong = true;
        }
      }else{
        this.tooManyCharUsername = true;
      }
    }else{
      this.tooManyCharEmail = true;
    }
  }

  get f() { return this.signupForm.controls; }

  handleResponse(data){
    this.loading = false;
    this.tokenService.handle(data.access_token, data.user_id, data.user_status);
    this.statusService.changeAuthStatus(true);
    this.router.navigateByUrl('/profile');
  }

  // error handling for email format and password match
  handleError(error){
    this.errorMessage = error.error.errors;
    console.log(error);
    this.loading = false;
  }

}
