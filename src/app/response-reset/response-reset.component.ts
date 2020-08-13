import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.scss']
})
export class ResponseResetComponent implements OnInit {

  public errorMessage;
  public errorMessageEmailOrToken;
  submitted = false;
  loading = false;
  pwResetForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required],
    reset_token: null
  });

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navigator: Router
    ) { 
      this.router.queryParams.subscribe( 
        params => {
          this.pwResetForm.controls['reset_token'].setValue(params['token'])
        }
      );
    }

  ngOnInit() {
  }
  
  onSubmit(){
    this.submitted = true;
    this.loading = true;

    this.authService.changePassword(this.pwResetForm.value).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data){
    this.navigator.navigateByUrl("/login");
  }

  // error handling for email format and password match
  handleError(error){
    this.errorMessageEmailOrToken = null;
    this.errorMessage = error.error.errors;

    if(!this.errorMessage){
      this.errorMessageEmailOrToken = "The email is wrong";
    }

    this.loading = false;
  }

  get f() { return this.pwResetForm.controls; }

}
