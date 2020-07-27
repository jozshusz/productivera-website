import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://www.prodbackend.com/api/';

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

}
