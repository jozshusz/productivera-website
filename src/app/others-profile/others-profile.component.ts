import { Component, OnInit } from '@angular/core';
import { OthersProfileService } from '../services/others-profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { MessageService } from '../services/message.service';
import { IdeaService } from '../services/idea.service';

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
  
  isLoggedIn = false;
  adminOrMod = false;
  userId = null;

  tooManyCharHeader = false;
  tooManyCharBody = false;
  sentMsg = false;
  loading = false;

  constructor(
    private othersProfService: OthersProfileService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private msgService: MessageService,
    private router: Router,
    private ideaService: IdeaService
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
      this.isLoggedIn = this.tokenService.loggedIn();

      // check if user is logged in
      if(this.isLoggedIn){
        this.userId = this.tokenService.getUserId();
        if(this.tokenService.getUserStatus() == 'admin' || this.tokenService.getUserStatus() == 'mod'){
          this.adminOrMod = true;
        }
      }
    });
  }

  initProfile(){
    this.othersProfService.getOthersProfile(this.profileId).subscribe(
      data => {
        this.profileInfo = data;
        this.checkUpvotedStatus();
      },
      error => console.log(error)
    );
  }

  onSubmit(){
    if(this.newMessageForm.value["messageHeader"].length < 71){
      this.tooManyCharHeader = false;
      if(this.newMessageForm.value["messageText"].length < 301){
        this.tooManyCharBody = false;
        this.submitted = true;
        this.loading = true;

        this.newMessageForm.controls['token'].setValue(this.token['token']);
        this.newMessageForm.controls['receiver'].setValue(this.profileId);
        this.msgService.sendMessage(this.newMessageForm.value)
        .subscribe((res: any) => {
          this.loading = false;
          this.submitted = false;
          this.sendNewMessageToggle = !this.sendNewMessageToggle;
          this.sentMsg = true;
          this.newMessageForm.controls["messageHeader"].setValue("");
          this.newMessageForm.controls["messageText"].setValue("");
        }, error => {
          console.error(error);
          this.loading = false;
        });
      }else{
        this.tooManyCharBody = true;
        this.loading = false;
      }
    }else{
      this.tooManyCharHeader = true;
      this.loading = false;
    }
  }

  get f() { return this.newMessageForm.controls; }

  newMessage(){
    if(this.isLoggedIn){
      this.sendNewMessageToggle = !this.sendNewMessageToggle;
      this.sentMsg = false;
    }else{
      this.router.navigateByUrl('/login');
    }
  }
  
  // admin/mod delete
  banUser(userId){
    document.getElementById("closeButton-" + userId).click();
    this.othersProfService.banUser({
      "token": this.token['token'],
      "userId": userId
    }).subscribe(
      data => {
        this.profileInfo['is_banned'] = true;
      },
      error => {
        console.log('Error while banning the user');
      }
    );
  }

  checkUpvotedStatus(){
    // check if an idea is upvoted by the current user
    for (var i = 0; i < this.profileInfo.ideas.length; i++) {
      for (var j = 0; j < this.profileInfo.ideas[i].upvotes.length; j++) {
        if(this.profileInfo.ideas[i].upvotes[j]['user_id'] == this.userId){
          this.profileInfo.ideas[i]['upvoted'] = true;
          break;
        }
      }
    }
  }

  upvote(event: MouseEvent, ideaId){
    if(this.isLoggedIn){
      var postData = {
        'ideaId': ideaId,
        'token': this.token['token']
      };
      event.preventDefault();
      this.ideaService.upvote(postData)
      .subscribe(
        data => {
          let isUpvoted = this.profileInfo.ideas.filter(x => x.id == ideaId)[0].upvoted;
          if(isUpvoted){
            this.profileInfo.ideas.filter(x => x.id == ideaId)[0].upvoted = false;
            this.profileInfo.ideas.filter(x => x.id == ideaId)[0].upvotes_count -= 1;
          }else{
            this.profileInfo.ideas.filter(x => x.id == ideaId)[0].upvoted = true;
            this.profileInfo.ideas.filter(x => x.id == ideaId)[0].upvotes_count += 1;
          }
      }, error => {
        console.error(error);
      });
    }else{
      event.preventDefault();
      this.router.navigateByUrl('/login');
    }
  }
}
