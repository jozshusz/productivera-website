import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { StatusService } from '../services/status.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { ProfileService } from '../services/profile.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { MsgNotiService } from '../services/msg-noti.service';
import { HttpHeaders } from '@angular/common/http';

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
  errorMessage = null;
  responseMessage = null;
  
  selectedFile: File = null;
  loadingAvatarUpload = false;

  @ViewChild('selectFileInput')
  selectFileInput: ElementRef;

  expertiseEdit = false;
  newExpertiseText = null;
  tooManyEditExpertise = false;
  
  descEdit = false;
  newDescText = null;
  tooManyEditDesc = false;

  replyLoading = false;
  replySuccess = false;

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
    this.replySuccess = false;
    this.replyLoading = true;
    this.submitted = true;
    this.replyMessageForm.controls['token'].setValue(this.token['token']);
    this.replyMessageForm.controls['receiver'].setValue(receiverId);
    let newHeader = "Reply: " + header;
    this.replyMessageForm.controls['messageHeader'].setValue(newHeader);
    this.msgService.sendMessage(this.replyMessageForm.value)
    .subscribe((res: any) => {
      this.replyLoading = false;
      this.replySuccess = true;
      this.replyToMessage();
      this.profileInfo.sent.unshift(res['msg']);
    }, error => {
      this.replyLoading = false;
      this.replySuccess = false;
    });
  }

  get f() { return this.replyMessageForm.controls; }

  // Upload avatar
  onFileSelected(event){
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload(){
    this.loadingAvatarUpload = true;
    this.responseMessage = null;
    this.errorMessage = null;

    const formData = new FormData();
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    formData.append('image', this.selectedFile);
    formData.append('token', this.token['token']);

    this.profileService.uploadAvatar(formData, headers).subscribe(
      data => this.handleAvatarResponse(data),
      error => this.handleAvatarError(error)
    );
  }

  handleAvatarResponse(data){
    this.loadingAvatarUpload = false;
    this.selectFileInput.nativeElement.value = "";
    this.responseMessage = data.message;
    this.profileInfo.avatar = data.newAvatar;
    this.selectedFile = null;
  }

  handleAvatarError(error){
    this.loadingAvatarUpload = false;
    this.errorMessage = error.error.error;
    this.selectedFile = null;
  }

  editExpertise(event: MouseEvent){
    event.preventDefault();
    this.expertiseEdit = true;
    this.newExpertiseText = this.profileInfo.expertise;
  }

  saveEditExpertise(){
    if(this.newExpertiseText.length < 26){
      this.tooManyEditExpertise = false;
      
      this.profileService.editExpertise({
        'token': this.token['token'],
        'expertise': this.newExpertiseText
      }).subscribe(
        data => 
        {
          this.profileInfo.expertise = data['expertise'];
          this.expertiseEdit = false;
        },
        error => 
        {
          console.log(error);
        }
      );
    }else{
      this.tooManyEditExpertise = true;
    }
  }

  cancelEditExpertise(){
    this.expertiseEdit = false;
  }

  editDescription(event: MouseEvent){
    event.preventDefault();
    this.descEdit = true;
    this.newDescText = this.profileInfo.description;
  }

  saveEditDesc(){
    if(this.newDescText.length < 231){
      this.tooManyEditDesc = false;
      
      this.profileService.editDesc({
        'token': this.token['token'],
        'description': this.newDescText
      }).subscribe(
        data => 
        {
          this.profileInfo.description = data['description'];
          this.descEdit = false;
        },
        error => 
        {
          console.log(error);
        }
      );
    }else{
      this.tooManyEditDesc = true;
    }
  }

  cancelEditDesc(){
    this.descEdit = false;
  }

}
