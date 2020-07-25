import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error: string;
  loading = false;
  isLogin = false;
  isSignUp = false;

  constructor(
    private router: Router
    ) { }

  ngOnInit() {
  }

  onSubmit(form){
    
  }

}
