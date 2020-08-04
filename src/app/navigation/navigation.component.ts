import { Component, OnInit } from '@angular/core';
import { StatusService } from '../services/status.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { BehaviorSubject } from 'rxjs';
import { MsgNotiService } from '../services/msg-noti.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public loggedIn: boolean;
  hideNotification = true;

  constructor(
    private statusService: StatusService,
    private router: Router,
    private tokenService: TokenService,
    private msgNotiService: MsgNotiService
    ) { }

  ngOnInit() {
    this.statusService.authStatus.subscribe( value => this.loggedIn = value );

    this.msgNotiService.newMsgNoti.subscribe( value => this.hideNotification = !value );
  }

  logout(event: MouseEvent){
    event.preventDefault();
    this.statusService.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
    this.tokenService.remove();
  }
}
