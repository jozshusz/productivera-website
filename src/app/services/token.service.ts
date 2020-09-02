import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login: 'https://api.productivera.com/api/login',
    signup: 'https://api.productivera.com/api/signup'
  };

  constructor() { }

  handle(token, userId, status){
    this.set(token, userId, status);
  }

  set(token, userId, status){
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('status', status);
  }

  get(){
    return localStorage.getItem('token');
  }

  getUserId(){
    return localStorage.getItem('userId');
  }

  getUserStatus(){
    return localStorage.getItem('status');
  }

  remove(){
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('status');
  }

  isValid(){
    const token = this.get();
    if(token){
      const payload = this.payload(token);
      if(payload){
        // it means that if we have >-1 then there is an index and iss matches one of the urls
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }
    return false;
  }

  payload(token){
    const payload = token.split(".")[1];
    return this.decode(payload);
  }

  decode(payload){
    return JSON.parse(atob(payload));
  }

  loggedIn(){
    return this.isValid();
  }
}
