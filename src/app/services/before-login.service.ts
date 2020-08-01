import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeforeLoginService implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
    ) { }

  loggedIn: boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    this.loggedIn = this.tokenService.loggedIn();

    if(this.loggedIn){
      this.router.navigateByUrl('');
    }

    return !this.loggedIn;
  }

}
