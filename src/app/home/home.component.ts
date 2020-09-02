import { Component, OnInit } from '@angular/core';
import { IdeaService } from '../services/idea.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  paginatorData = null;
  ideaList = null;
  currentIdea = null;

  counter = 0;
  joinIdea = false;
  token = null;
  loggedIn = false;

  newJoinForm: FormGroup;
  submitted = false;

  tooManyCharHeader = false;
  tooManyCharBody = false;
  sentMsg = false;
  loading = false;
  // own id
  userId = null;

  constructor(
    private ideaService: IdeaService,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private router: Router,
    private msgService: MessageService
    ) { }

  ngOnInit() {
    this.initIdeas();
    this.newJoinForm = this.formBuilder.group({
      messageHeader: ['', Validators.required],
      messageText: ['', Validators.required],
      receiver: null,
      token: null
    });

    this.token = {
      'token': this.tokenService.get()
    };
    this.loggedIn = this.tokenService.loggedIn();
    if(this.loggedIn){
      this.userId = this.tokenService.getUserId();
    }
  }

  initIdeas(){
    this.ideaService.getIdeas()
      .subscribe((res: any) => {
        this.paginatorData = res;
        this.ideaList = res["data"];
        this.currentIdea = this.ideaList[0];
      }, error => {
        console.error(error);
      });
  }

  learnMoreButton(){
    document.getElementById("informationSection").scrollIntoView({ block: 'center',  behavior: 'smooth' });
  }

  nextIdea(){
    if(this.counter < 12 && this.counter < this.ideaList.length - 1){
      this.counter += 1;
      this.currentIdea = this.ideaList[this.counter];
    }
  }

  prevIdea(){
    if(this.counter > 0){
      this.counter -= 1;
      this.currentIdea = this.ideaList[this.counter];
    }
  }

  openJoinRequest(ideaId, event){
    event.preventDefault();
    if(this.loggedIn){
      if(this.currentIdea['joinOpen']){
        this.currentIdea['joinOpen'] = !this.currentIdea['joinOpen'];
      }else{
        this.currentIdea['joinOpen'] = true;
      }
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit(){
    if(this.newJoinForm.value["messageHeader"].length < 71){
      this.tooManyCharHeader = false;
      if(this.newJoinForm.value["messageText"].length < 301){
        this.tooManyCharBody = false;
        this.submitted = true;
        this.loading = true;

        var newHeader = "Join request - " + this.currentIdea['title'] + ": " + this.newJoinForm.value["messageHeader"];
        this.newJoinForm.controls['messageHeader'].setValue(newHeader);
        this.newJoinForm.controls['token'].setValue(this.token['token']);
        this.newJoinForm.controls['receiver'].setValue(this.currentIdea['user_id']);
        this.msgService.sendMessage(this.newJoinForm.value)
        .subscribe((res: any) => {
          this.loading = false;
          this.submitted = false;
          this.currentIdea['joinOpen'] = false;
          this.sentMsg = true;
          this.newJoinForm.controls["messageHeader"].setValue("");
          this.newJoinForm.controls["messageText"].setValue("");
        }, error => {
          console.error(error);
          this.loading = false;
          this.newJoinForm.controls['messageHeader'].setValue("");
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

  get f() { return this.newJoinForm.controls; }

}
