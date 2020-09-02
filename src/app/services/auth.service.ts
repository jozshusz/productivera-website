import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://api.productivera.com/api/';

  constructor(
    private router: Router,
    private http: HttpClient
    ) { }

    signUp(data) {
      return this.http.post(this.baseUrl + 'signup', data);
    }
  
    login(data) {
      return this.http.post(this.baseUrl + 'login', data);
    }

    sendPasswordResetLink(data){
      return this.http.post(this.baseUrl + 'passwordResetLink', data);
    }
  
    changePassword(data){
      return this.http.post(this.baseUrl + 'changePassword', data);
    }
  
    getCurrentUser(data){
      return this.http.post(this.baseUrl + 'me', data);
    }
}
