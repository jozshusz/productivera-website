import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent implements OnInit {

  public errorMessage;
  loading = false;
  submitted = false;
  successEmailSent = false;

  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  onSubmit(){
    this.submitted = true;
    this.loading = true;
    this.authService.sendPasswordResetLink(this.form.value).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  get f() { return this.form.controls; }

  handleResponse(res){
    this.errorMessage = null;
    this.successEmailSent = true;
    this.form.value.email = null;
    this.loading = false;
  }

  // error handling for email format and password match
  handleError(error){
    this.errorMessage = error.error.error;
    this.successEmailSent = false;

    this.loading = false;
  }

}
