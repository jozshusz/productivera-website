import { Component, OnInit } from '@angular/core';
import { OthersProfileService } from '../services/others-profile.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-others-profile',
  templateUrl: './others-profile.component.html',
  styleUrls: ['./others-profile.component.scss']
})
export class OthersProfileComponent implements OnInit {

  newMessageForm: FormGroup;
  submitted = false;
  profileId = null;
  profileInfo = null;
  token = null;
  sendNewMessageToggle = false;

  constructor(
    private othersProfService: OthersProfileService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private msgService: MessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.profileId = paramMap.get('userId');
      this.initProfile();
      this.newMessageForm = this.formBuilder.group({
        messageHeader: ['', Validators.required],
        messageText: ['', Validators.required],
        receiver: null,
        token: null
      });
  
      this.token = {
        'token': this.tokenService.get()
      };
    });
  }

  initProfile(){
    this.othersProfService.getOthersProfile(this.profileId).subscribe(
      data => {
        this.profileInfo = data;
      },
      error => console.log(error)
    );
  }

  onSubmit(){
    this.submitted = true;

    this.newMessageForm.controls['token'].setValue(this.token['token']);
    this.newMessageForm.controls['receiver'].setValue(this.profileId);
    this.msgService.sendMessage(this.newMessageForm.value)
    .subscribe((res: any) => {
      console.log(res);
    }, error => {
      console.error(error);
    });
  }

  get f() { return this.newMessageForm.controls; }

  newMessage(){
    this.sendNewMessageToggle = !this.sendNewMessageToggle;
  }
}
