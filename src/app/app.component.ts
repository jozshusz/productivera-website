import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MsgNotiService } from './services/msg-noti.service';
import { TokenService } from './services/token.service';
import { BehaviorSubject } from 'rxjs';
import { StatusService } from './services/status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'productivera-site';
  data = null;
  
  constructor(
    private router: Router,
    private msgNotiService: MsgNotiService,
    private tokenService: TokenService,
    private statusService: StatusService
    ) { }

  ngOnInit(){
    this.router.events.subscribe(event => {
       if (event instanceof NavigationStart){
          this.checkForNotification();
       }
    });

    // check if the user's token is expired or not, if yes then logging out
    let tokenExp = this.tokenService.payload(this.tokenService.get()).exp;
    let now = Math.floor((new Date).getTime() / 1000);
    if(now > tokenExp){
      console.log('Logging out.');
      this.statusService.changeAuthStatus(false);
      this.tokenService.remove();
    }else{
      console.log('Token is still valid');
    }
  }

  checkForNotification(){
    if(this.tokenService.loggedIn()){
      this.data = {
        'token': this.tokenService.get()
      };
      this.msgNotiService.checkForNotiMsg(this.data);
    }else{
      console.log('Not logged in.');
    }
  }
}
