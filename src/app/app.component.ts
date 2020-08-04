import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MsgNotiService } from './services/msg-noti.service';
import { TokenService } from './services/token.service';
import { BehaviorSubject } from 'rxjs';

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
    private tokenService: TokenService
    ) { }

  ngOnInit(){
    this.router.events.subscribe(event => {
       if (event instanceof NavigationStart){
          this.checkForNotification();
       }
    });
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
