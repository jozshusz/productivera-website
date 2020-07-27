import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private loggedIn = new BehaviorSubject<boolean>(this.tokenService.loggedIn());
  authStatus = this.loggedIn.asObservable();

  changeAuthStatus(value: boolean){
    this.loggedIn.next(value);
  }

  constructor(
    private tokenService: TokenService
  ) { }

}
