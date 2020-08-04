import { Component, OnInit } from '@angular/core';
import { StatusService } from '../services/status.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ProfileService } from '../services/profile.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { MsgNotiService } from '../services/msg-noti.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileInfo = null;
  token = null;
  replyToMsg = false;
  replyMessageForm: FormGroup;
  submitted = false;
  displayNotification = null;
  allNotifShowing = false;

  constructor(
    private statusService: StatusService,
    private router: Router,
    private tokenService: TokenService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private msgNotiService: MsgNotiService
    ) { }

  ngOnInit() {
    this.token = {
      'token': this.tokenService.get()
    };
    this.replyMessageForm = this.formBuilder.group({
      messageHeader: null,
      messageText: ['', Validators.required],
      receiver: null,
      token: null
    });

    this.profileService.getOwnProfile(this.token).subscribe(
      data => {
        this.profileInfo = data;
        this.displayNotification = this.profileInfo["notifications"].slice(0, 5);
      },
      error => {
        console.log(error);
      }
    );
  }
  
  logout(event: MouseEvent){
    event.preventDefault();
    this.statusService.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
    this.tokenService.remove();
  }

  showMoreNotification(){
    this.displayNotification = this.profileInfo["notifications"];
    this.allNotifShowing = true;
  }

  showLessNotification(){
    this.displayNotification = this.displayNotification.slice(0, 5);
    this.allNotifShowing = false;
  }

  toggleMsgNoti(msgNoti, checkNeeded){
    msgNoti['show'] = !msgNoti['show'];
    let dataJson = null;
    // checkNeeded only true if 'opened' field needs to be changed (notifications and reveived msg)
    if(checkNeeded){
      if(!msgNoti.opened){
        dataJson = {
          'token' : this.token['token'],
          'id' : msgNoti.id
        };
        if(msgNoti.idea_id || msgNoti.userpost_id){
          dataJson['type'] = 'notification';
        }else{
          dataJson['type'] = 'message';
        }
        this.msgNotiService.setOpenMsgNoti(dataJson).subscribe(
          data => msgNoti['opened'] = true,
          error => console.log(error)
        );
        console.log('ja');
      }
    }
  }

  replyToMessage(){
    this.replyToMsg = !this.replyToMsg;
  }

  onSubmit(){
    this.submitted = true;
  }

  sendTheReply(receiverId, header){
    this.submitted = true;
    this.replyMessageForm.controls['token'].setValue(this.token['token']);
    this.replyMessageForm.controls['receiver'].setValue(receiverId);
    let newHeader = "Reply: " + header;
    this.replyMessageForm.controls['messageHeader'].setValue(newHeader);
    this.msgService.sendMessage(this.replyMessageForm.value)
    .subscribe((res: any) => {
      console.log(res);
    }, error => {
      console.error(error);
    });
  }

  get f() { return this.replyMessageForm.controls; }
}
