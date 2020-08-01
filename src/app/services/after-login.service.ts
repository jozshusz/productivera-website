import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { CanActivate, Router } from '@angular/router';
import{ ActivatedRouteSnapshot } from "@angular/router";
import{ RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AfterLoginService implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
    ) { }

  loggedIn: boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    this.loggedIn = this.tokenService.loggedIn();

    if(!this.loggedIn){
      this.router.navigateByUrl('/login');
    }
    
    return this.loggedIn;
  }
}
